import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create basic permissions
  const permissions = [
    // Blog permissions
    { name: "Create Blog Post", slug: "blog_post-create", resource: "blog_post", action: "create" },
    { name: "Read Blog Post", slug: "blog_post-read", resource: "blog_post", action: "read" },
    { name: "Update Blog Post", slug: "blog_post-update", resource: "blog_post", action: "update" },
    { name: "Delete Blog Post", slug: "blog_post-delete", resource: "blog_post", action: "delete" },
    // Event permissions
    { name: "Create Event", slug: "event-create", resource: "event", action: "create" },
    { name: "Read Event", slug: "event-read", resource: "event", action: "read" },
    { name: "Update Event", slug: "event-update", resource: "event", action: "update" },
    { name: "Delete Event", slug: "event-delete", resource: "event", action: "delete" },
    // Category permissions
    { name: "Create Category", slug: "category-create", resource: "category", action: "create" },
    { name: "Read Category", slug: "category-read", resource: "category", action: "read" },
    { name: "Update Category", slug: "category-update", resource: "category", action: "update" },
    { name: "Delete Category", slug: "category-delete", resource: "category", action: "delete" },
    { name: "Manage Categories", slug: "category-manage", resource: "category", action: "manage" },
    // Tag permissions
    { name: "Manage Tags", slug: "tag-manage", resource: "tag", action: "manage" },
    // Comment permissions
    { name: "Create Comment", slug: "comment-create", resource: "comment", action: "create" },
    { name: "Read Comment", slug: "comment-read", resource: "comment", action: "read" },
    { name: "Update Comment", slug: "comment-update", resource: "comment", action: "update" },
    { name: "Approve Comments", slug: "comment-approve", resource: "comment", action: "approve" },
    { name: "Delete Comments", slug: "comment-delete", resource: "comment", action: "delete" },
    // User permissions
    { name: "Manage Users", slug: "user-manage", resource: "user", action: "manage" },
    // Role permissions
    { name: "Create Role", slug: "role-create", resource: "role", action: "create" },
    { name: "Read Role", slug: "role-read", resource: "role", action: "read" },
    { name: "Update Role", slug: "role-update", resource: "role", action: "update" },
    { name: "Delete Role", slug: "role-delete", resource: "role", action: "delete" },
    // Permission permissions
    { name: "Create Permission", slug: "permission-create", resource: "permission", action: "create" },
    { name: "Read Permission", slug: "permission-read", resource: "permission", action: "read" },
    { name: "Update Permission", slug: "permission-update", resource: "permission", action: "update" },
    { name: "Delete Permission", slug: "permission-delete", resource: "permission", action: "delete" },
    // User Role permissions
    { name: "Assign User Role", slug: "user_role-create", resource: "user_role", action: "create" },
    { name: "Remove User Role", slug: "user_role-delete", resource: "user_role", action: "delete" },
    // Subscription permissions
    { name: "Create Subscription", slug: "subscription-create", resource: "subscription", action: "create" },
    { name: "Read Subscription", slug: "subscription-read", resource: "subscription", action: "read" },
    { name: "Update Subscription", slug: "subscription-update", resource: "subscription", action: "update" },
    { name: "Delete Subscription", slug: "subscription-delete", resource: "subscription", action: "delete" },
    // Subscription Plan permissions
    { name: "Create Subscription Plan", slug: "subscription_plan-create", resource: "subscription_plan", action: "create" },
    { name: "Update Subscription Plan", slug: "subscription_plan-update", resource: "subscription_plan", action: "update" },
    { name: "Delete Subscription Plan", slug: "subscription_plan-delete", resource: "subscription_plan", action: "delete" },
    // Feature permissions
    { name: "Create Feature", slug: "feature-create", resource: "feature", action: "create" },
    { name: "Update Feature", slug: "feature-update", resource: "feature", action: "update" },
    { name: "Delete Feature", slug: "feature-delete", resource: "feature", action: "delete" },
  ];

  console.log("Creating permissions...");
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { slug: permission.slug },
      update: {},
      create: permission,
    });
  }
  console.log(`✅ Created ${permissions.length} permissions`);

  // Create roles
  console.log("Creating roles...");

  // Admin role - has all permissions
  const adminRole = await prisma.role.upsert({
    where: { slug: "admin" },
    update: {},
    create: {
      name: "Administrator",
      slug: "admin",
      description: "Full system access with all permissions",
      isSystem: true,
    },
  });

  // Assign all permissions to admin
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }
  console.log(`✅ Created Admin role with all permissions`);

  // Manager role - can manage content, users, and moderate
  const managerRole = await prisma.role.upsert({
    where: { slug: "manager" },
    update: {},
    create: {
      name: "Manager",
      slug: "manager",
      description: "Can manage content, users, and moderate, but not system settings",
      isSystem: true,
    },
  });

  const managerPermissionSlugs = [
    "blog_post-create",
    "blog_post-read",
    "blog_post-update",
    "blog_post-delete",
    "event-create",
    "event-read",
    "event-update",
    "event-delete",
    "category-create",
    "category-read",
    "category-update",
    "category-delete",
    "category-manage",
    "tag-manage",
    "comment-create",
    "comment-read",
    "comment-update",
    "comment-approve",
    "comment-delete",
    "user-manage",
    "subscription-read",
  ];
  
  for (const slug of managerPermissionSlugs) {
    const permission = await prisma.permission.findUnique({ where: { slug } });
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: managerRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: managerRole.id,
          permissionId: permission.id,
        },
      });
    }
  }
  console.log(`✅ Created Manager role`);

  // Content Manager role - can manage content (for admin panel access)
  const contentManagerRole = await prisma.role.upsert({
    where: { slug: "content_manager" },
    update: {},
    create: {
      name: "Content Manager",
      slug: "content_manager",
      description: "Can manage all content including blog posts and events",
      isSystem: true,
    },
  });

  const contentManagerPermissionSlugs = [
    "blog_post-create",
    "blog_post-read",
    "blog_post-update",
    "blog_post-delete",
    "event-create",
    "event-read",
    "event-update",
    "event-delete",
    "category-create",
    "category-read",
    "category-update",
    "category-delete",
    "category-manage",
    "tag-manage",
    "comment-create",
    "comment-read",
    "comment-update",
    "comment-approve",
    "comment-delete",
  ];
  
  for (const slug of contentManagerPermissionSlugs) {
    const permission = await prisma.permission.findUnique({ where: { slug } });
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: contentManagerRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: contentManagerRole.id,
          permissionId: permission.id,
        },
      });
    }
  }
  console.log(`✅ Created Content Manager role`);

  // Editor role - can manage all content and approve comments
  const editorRole = await prisma.role.upsert({
    where: { slug: "editor" },
    update: {},
    create: {
      name: "Editor",
      slug: "editor",
      description: "Can manage all blog content and approve comments",
      isSystem: true,
    },
  });

  const editorPermissionSlugs = [
    "blog_post-create",
    "blog_post-read",
    "blog_post-update",
    "blog_post-delete",
    "event-create",
    "event-read",
    "event-update",
    "event-delete",
    "category-create",
    "category-read",
    "category-update",
    "category-delete",
    "category-manage",
    "tag-manage",
    "comment-create",
    "comment-read",
    "comment-update",
    "comment-approve",
    "comment-delete",
  ];
  
  for (const slug of editorPermissionSlugs) {
    const permission = await prisma.permission.findUnique({ where: { slug } });
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: editorRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: editorRole.id,
          permissionId: permission.id,
        },
      });
    }
  }
  console.log(`✅ Created Editor role`);

  // Author role - can create and manage own blog posts
  const authorRole = await prisma.role.upsert({
    where: { slug: "author" },
    update: {},
    create: {
      name: "Author",
      slug: "author",
      description: "Can create and manage own blog posts",
      isSystem: true,
    },
  });

  const authorPermissionSlugs = [
    "blog_post-create",
    "blog_post-read",
    "blog_post-update",
    "blog_post-delete",
    "event-create",
    "event-read",
    "event-update",
    "event-delete",
    "comment-create",
    "comment-read",
    "comment-update",
  ];
  
  for (const slug of authorPermissionSlugs) {
    const permission = await prisma.permission.findUnique({ where: { slug } });
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: authorRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: authorRole.id,
          permissionId: permission.id,
        },
      });
    }
  }
  console.log(`✅ Created Author role`);

  // Contributor role - can create posts but cannot publish
  const contributorRole = await prisma.role.upsert({
    where: { slug: "contributor" },
    update: {},
    create: {
      name: "Contributor",
      slug: "contributor",
      description: "Can create blog posts but needs approval to publish",
      isSystem: true,
    },
  });

  const contributorPermissionSlugs = [
    "blog_post-create",
    "blog_post-read",
    "blog_post-update",
    "comment-create",
    "comment-read",
    "comment-update",
  ];
  
  for (const slug of contributorPermissionSlugs) {
    const permission = await prisma.permission.findUnique({ where: { slug } });
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: contributorRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: contributorRole.id,
          permissionId: permission.id,
        },
      });
    }
  }
  console.log(`✅ Created Contributor role`);

  // Moderator role - can moderate comments and content
  const moderatorRole = await prisma.role.upsert({
    where: { slug: "moderator" },
    update: {},
    create: {
      name: "Moderator",
      slug: "moderator",
      description: "Can moderate comments and content",
      isSystem: true,
    },
  });

  const moderatorPermissionSlugs = [
    "blog_post-read",
    "comment-create",
    "comment-read",
    "comment-update",
    "comment-approve",
    "comment-delete",
  ];
  
  for (const slug of moderatorPermissionSlugs) {
    const permission = await prisma.permission.findUnique({ where: { slug } });
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: moderatorRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: moderatorRole.id,
          permissionId: permission.id,
        },
      });
    }
  }
  console.log(`✅ Created Moderator role`);

  // Subscriber role - can comment and has subscription benefits
  const subscriberRole = await prisma.role.upsert({
    where: { slug: "subscriber" },
    update: {},
    create: {
      name: "Subscriber",
      slug: "subscriber",
      description: "Can read content and comment, has subscription benefits",
      isSystem: true,
    },
  });

  const subscriberPermissionSlugs = [
    "blog_post-read",
    "comment-create",
    "comment-read",
  ];
  
  for (const slug of subscriberPermissionSlugs) {
    const permission = await prisma.permission.findUnique({ where: { slug } });
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: subscriberRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: subscriberRole.id,
          permissionId: permission.id,
        },
      });
    }
  }
  console.log(`✅ Created Subscriber role`);

  // User role - basic user
  const userRole = await prisma.role.upsert({
    where: { slug: "user" },
    update: {},
    create: {
      name: "User",
      slug: "user",
      description: "Basic user with read access",
      isSystem: true,
    },
  });

  const userPermissionSlugs = [
    "blog_post-read",
    "comment-read",
  ];
  
  for (const slug of userPermissionSlugs) {
    const permission = await prisma.permission.findUnique({ where: { slug } });
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: userRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      });
    }
  }
  console.log(`✅ Created User role`);

  // Create features
  console.log("Creating features...");
  
  const features = [
    { name: "Доступ к базовым событиям", slug: "basic-events-access", featureType: "boolean" },
    { name: "Доступ к премиум событиям", slug: "premium-events-access", featureType: "boolean" },
    { name: "Доступ к закрытым событиям", slug: "private-events-access", featureType: "boolean" },
    { name: "Ранний доступ к регистрации", slug: "early-registration", featureType: "boolean" },
    { name: "Бесплатный гость +1", slug: "free-guest", featureType: "boolean" },
    { name: "Цифровые фото с мероприятий", slug: "event-photos", featureType: "boolean" },
    { name: "Скидка на участие", slug: "event-discount", featureType: "numeric" },
    { name: "Доступ к дрифт-школе", slug: "drift-school-access", featureType: "boolean" },
    { name: "Персональный инструктор", slug: "personal-instructor", featureType: "boolean" },
    { name: "Приоритетная поддержка", slug: "priority-support", featureType: "boolean" },
    { name: "Доступ к закрытому клубу", slug: "exclusive-club-access", featureType: "boolean" },
    { name: "Фирменный мерч", slug: "branded-merch", featureType: "boolean" },
    { name: "VIP парковка", slug: "vip-parking", featureType: "boolean" },
    { name: "Количество мероприятий в месяц", slug: "monthly-events-limit", featureType: "numeric" },
  ];

  for (const feature of features) {
    await prisma.feature.upsert({
      where: { slug: feature.slug },
      update: {},
      create: feature,
    });
  }
  console.log(`✅ Created ${features.length} features`);

  // Create racing categories (drift, drag, ring, etc.)
  console.log("Creating racing categories...");

  const racingCategories = [
    {
      name: "Дрифт",
      slug: "drift",
      description: "Спортивное направление автомобильного спорта, где главной задачей является управление автомобилем в заносе на высоких скоростях",
      icon: "drift",
      color: "#D32F2F",
      featured: true,
      order: 1,
      showInNav: true,
    },
    {
      name: "Дрэг",
      slug: "drag",
      description: "Гонки на прямой трассе, где побеждает тот, кто первым пересечет финишную черту",
      icon: "drag",
      color: "#1976D2",
      featured: true,
      order: 2,
      showInNav: true,
    },
    {
      name: "Кольцевые гонки",
      slug: "ring",
      description: "Кольцевые автогонки на специализированных трассах с поворотами различной сложности",
      icon: "ring",
      color: "#388E3C",
      featured: true,
      order: 3,
      showInNav: true,
    },
    {
      name: "Клуб",
      slug: "club",
      description: "Автомобильный клуб JEMSO - встречи, мероприятия и общение единомышленников",
      icon: "club",
      color: "#F57C00",
      featured: false,
      order: 4,
      showInNav: true,
    },
  ];

  for (const category of racingCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log(`✅ Created ${racingCategories.length} racing categories`);

  // Create subscription plans
  console.log("Creating subscription plans...");

  const basicPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: "basic" },
    update: {},
    create: {
      name: "Базовый",
      slug: "basic",
      description: "Начальный уровень для знакомства с миром автоспорта",
      price: 1490,
      currency: "RUB",
      billingInterval: "month",
      trialDays: 7,
      isActive: true,
      order: 1,
    },
  });

  // Assign features to basic plan
  const basicFeatures = [
    { slug: "basic-events-access", value: null },
    { slug: "event-discount", value: "10" }, // 10% скидка
    { slug: "monthly-events-limit", value: "2" }, // 2 мероприятия в месяц
  ];

  for (const { slug, value } of basicFeatures) {
    const feature = await prisma.feature.findUnique({ where: { slug } });
    if (feature) {
      await prisma.planFeature.upsert({
        where: {
          planId_featureId: {
            planId: basicPlan.id,
            featureId: feature.id,
          },
        },
        update: {},
        create: {
          planId: basicPlan.id,
          featureId: feature.id,
          value,
        },
      });
    }
  }
  console.log(`✅ Created Базовый plan`);

  const advancedPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: "advanced" },
    update: {},
    create: {
      name: "Продвинутый",
      slug: "advanced",
      description: "Для активных участников с доступом к премиум событиям и дрифт-школе",
      price: 4990,
      currency: "RUB",
      billingInterval: "month",
      trialDays: 14,
      isActive: true,
      order: 2,
    },
  });

  // Assign features to advanced plan
  const advancedFeatures = [
    { slug: "basic-events-access", value: null },
    { slug: "premium-events-access", value: null },
    { slug: "early-registration", value: null },
    { slug: "event-photos", value: null },
    { slug: "event-discount", value: "20" }, // 20% скидка
    { slug: "drift-school-access", value: null },
    { slug: "priority-support", value: null },
    { slug: "monthly-events-limit", value: "5" }, // 5 мероприятий в месяц
  ];

  for (const { slug, value } of advancedFeatures) {
    const feature = await prisma.feature.findUnique({ where: { slug } });
    if (feature) {
      await prisma.planFeature.upsert({
        where: {
          planId_featureId: {
            planId: advancedPlan.id,
            featureId: feature.id,
          },
        },
        update: {},
        create: {
          planId: advancedPlan.id,
          featureId: feature.id,
          value,
        },
      });
    }
  }
  console.log(`✅ Created Продвинутый plan`);

  const vipPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: "vip" },
    update: {},
    create: {
      name: "VIP",
      slug: "vip",
      description: "Максимальный уровень с доступом ко всем привилегиям и закрытым мероприятиям",
      price: 12990,
      currency: "RUB",
      billingInterval: "month",
      trialDays: 14,
      isActive: true,
      order: 3,
    },
  });

  // Assign features to VIP plan
  const vipFeatures = [
    { slug: "basic-events-access", value: null },
    { slug: "premium-events-access", value: null },
    { slug: "private-events-access", value: null },
    { slug: "early-registration", value: null },
    { slug: "free-guest", value: null },
    { slug: "event-photos", value: null },
    { slug: "event-discount", value: "30" }, // 30% скидка
    { slug: "drift-school-access", value: null },
    { slug: "personal-instructor", value: null },
    { slug: "priority-support", value: null },
    { slug: "exclusive-club-access", value: null },
    { slug: "branded-merch", value: null },
    { slug: "vip-parking", value: null },
    { slug: "monthly-events-limit", value: "999" }, // неограниченно
  ];

  for (const { slug, value } of vipFeatures) {
    const feature = await prisma.feature.findUnique({ where: { slug } });
    if (feature) {
      await prisma.planFeature.upsert({
        where: {
          planId_featureId: {
            planId: vipPlan.id,
            featureId: feature.id,
          },
        },
        update: {},
        create: {
          planId: vipPlan.id,
          featureId: feature.id,
          value,
        },
      });
    }
  }
  console.log(`✅ Created VIP plan`);

  // Create default admin user
  console.log("Creating default admin user...");
  
  const adminEmail = "admin@jemsodrive.com";
  const adminPassword = "admin12345";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  // Assign admin role to the admin user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log(`✅ Created default admin user (${adminEmail})`);
  console.log(`   Password: ${adminPassword}`);

  // Create tags
  console.log("Creating tags...");
  
  const tags = [
    { name: "Тюнинг", slug: "tuning" },
    { name: "Техника", slug: "technique" },
    { name: "Новости", slug: "news" },
    { name: "Обзоры", slug: "reviews" },
    { name: "Гайды", slug: "guides" },
    { name: "Интервью", slug: "interviews" },
    { name: "Соревнования", slug: "competitions" },
    { name: "Автомобили", slug: "cars" },
    { name: "Запчасти", slug: "parts" },
    { name: "Безопасность", slug: "safety" },
  ];

  const createdTags = [];
  for (const tag of tags) {
    const createdTag = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
    createdTags.push(createdTag);
  }
  console.log(`✅ Created ${tags.length} tags`);

  // Get categories for posts
  const driftCategory = await prisma.category.findUnique({ where: { slug: "drift" } });
  const dragCategory = await prisma.category.findUnique({ where: { slug: "drag" } });
  const ringCategory = await prisma.category.findUnique({ where: { slug: "ring" } });
  const clubCategory = await prisma.category.findUnique({ where: { slug: "club" } });

  // Create blog posts
  console.log("Creating blog posts...");

  const blogPosts = [
    {
      title: "Топ-5 модификаций для дрифт-кара в 2024 году",
      slug: "top-5-drift-car-mods-2024",
      excerpt: "Узнайте, какие модификации помогут вывести ваш дрифт-кар на новый уровень",
      content: JSON.stringify({
        version: "1.0",
        blocks: [
          {
            id: "intro-1",
            type: "paragraph",
            order: 0,
            content: "Дрифт - это не просто вид автоспорта, это искусство управления автомобилем в заносе. Чтобы достичь успеха в дрифте, необходимо правильно подготовить автомобиль. В этой статье мы рассмотрим топ-5 модификаций, которые помогут улучшить характеристики вашего дрифт-кара.",
          },
          {
            id: "mod-1-heading",
            type: "heading",
            order: 1,
            content: "1. Дифференциал повышенного трения (LSD)",
            level: "2",
          },
          {
            id: "mod-1-desc",
            type: "paragraph",
            order: 2,
            content: "Один из самых важных элементов дрифт-кара. LSD позволяет обоим колесам вращаться с одинаковой скоростью, что критично для контролируемого заноса.",
          },
          {
            id: "mod-1-callout",
            type: "callout",
            order: 3,
            title: "Важно знать",
            content: "Для начинающих дрифтеров рекомендуется LSD с коэффициентом блокировки 1.5-2 way. Более агрессивные варианты подойдут для опытных пилотов.",
            variant: "info",
          },
          {
            id: "mod-2-heading",
            type: "heading",
            order: 4,
            content: "2. Гидравлический ручной тормоз",
            level: "2",
          },
          {
            id: "mod-2-desc",
            type: "paragraph",
            order: 5,
            content: "Гидроручник - незаменимый инструмент для инициации заноса и коррекции траектории. Профессиональные дрифтеры используют его постоянно.",
          },
          {
            id: "mod-3-heading",
            type: "heading",
            order: 6,
            content: "3. Усиленная подвеска",
            level: "2",
          },
          {
            id: "mod-3-desc",
            type: "paragraph",
            order: 7,
            content: "Койловеры с регулируемой жесткостью позволяют настроить баланс автомобиля под свой стиль вождения и особенности трассы.",
          },
          {
            id: "mod-4-heading",
            type: "heading",
            order: 8,
            content: "4. Увеличенный угол поворота передних колес",
            level: "2",
          },
          {
            id: "mod-4-desc",
            type: "paragraph",
            order: 9,
            content: "Специальные рычаги подвески позволяют увеличить угол поворота до 60-70 градусов, что критично для больших углов заноса.",
          },
          {
            id: "mod-5-heading",
            type: "heading",
            order: 10,
            content: "5. Система охлаждения",
            level: "2",
          },
          {
            id: "mod-5-desc",
            type: "paragraph",
            order: 11,
            content: "Усиленный радиатор и масляный кулер помогут поддерживать оптимальную температуру двигателя даже при экстремальных нагрузках.",
          },
          {
            id: "conclusion",
            type: "paragraph",
            order: 12,
            content: "Все эти модификации значительно улучшат характеристики вашего дрифт-кара и помогут достичь лучших результатов на треке.",
          },
        ],
      }),
      published: true,
      publishedAt: new Date("2024-01-15"),
      views: 1245,
      categoryId: driftCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&h=600&fit=crop",
      tags: ["tuning", "technique", "guides"],
    },
    {
      title: "История дрэг-рейсинга: от улиц до профессиональных треков",
      slug: "drag-racing-history",
      excerpt: "Погрузитесь в увлекательную историю развития дрэг-рейсинга от подпольных гонок до международных чемпионатов",
      content: JSON.stringify({
        version: "1.0",
        blocks: [
          {
            id: "intro",
            type: "paragraph",
            order: 0,
            content: "Дрэг-рейсинг зародился в США в 1940-х годах как уличные гонки на прямых участках дорог. Со временем это движение превратилось в полноценный вид автоспорта с профессиональными трассами и международными соревнованиями.",
          },
          {
            id: "era-1-heading",
            type: "heading",
            order: 1,
            content: "Ранние годы (1940-1950)",
            level: "2",
          },
          {
            id: "era-1-desc",
            type: "paragraph",
            order: 2,
            content: "После Второй мировой войны многие демобилизованные солдаты привезли с собой опыт работы с техникой. Они начали модифицировать свои автомобили и соревноваться на заброшенных взлетных полосах.",
          },
          {
            id: "era-2-heading",
            type: "heading",
            order: 3,
            content: "Профессионализация (1960-1980)",
            level: "2",
          },
          {
            id: "era-2-desc",
            type: "paragraph",
            order: 4,
            content: "В 1951 году была основана National Hot Rod Association (NHRA), которая стандартизировала правила и создала безопасную среду для соревнований. Появились специализированные drag strips - прямые трассы длиной четверть мили (402 метра).",
          },
          {
            id: "image-1",
            type: "image",
            order: 5,
            src: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&h=600&fit=crop",
            alt: "Дрэг-рейсинг трек",
            caption: "Современная drag strip трасса",
            alignment: "center",
          },
          {
            id: "era-3-heading",
            type: "heading",
            order: 6,
            content: "Современная эра (1990-настоящее время)",
            level: "2",
          },
          {
            id: "era-3-desc",
            type: "paragraph",
            order: 7,
            content: "Сегодня дрэг-рейсинг - это высокотехнологичный спорт, где автомобили развивают скорость более 530 км/ч и проходят четверть мили менее чем за 4 секунды. В России дрэг-рейсинг активно развивается с начала 2000-х годов.",
          },
          {
            id: "stats",
            type: "stats",
            order: 8,
            stats: [
              { label: "Максимальная скорость", value: "530+ км/ч", description: "Top Fuel класс" },
              { label: "Время заезда", value: "< 4 сек", description: "Четверть мили" },
              { label: "Мощность двигателя", value: "11000+ л.с.", description: "Top Fuel класс" },
            ],
            columns: 3,
          },
        ],
      }),
      published: true,
      publishedAt: new Date("2024-01-20"),
      views: 856,
      categoryId: dragCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=600&fit=crop",
      tags: ["news", "competitions"],
    },
    {
      title: "Подготовка к первому трек-дню: чек-лист для начинающих",
      slug: "first-track-day-checklist",
      excerpt: "Полное руководство по подготовке автомобиля и себя к первому выезду на трек",
      content: JSON.stringify({
        version: "1.0",
        blocks: [
          {
            id: "intro",
            type: "paragraph",
            order: 0,
            content: "Собираетесь на свой первый трек-день? Это захватывающий опыт, но важно правильно подготовиться. Вот полный чек-лист, который поможет вам избежать проблем и получить максимум удовольствия.",
          },
          {
            id: "car-prep-heading",
            type: "heading",
            order: 1,
            content: "Подготовка автомобиля",
            level: "2",
          },
          {
            id: "tech-inspection-heading",
            type: "heading",
            order: 2,
            content: "Технический осмотр",
            level: "3",
          },
          {
            id: "tech-inspection-list",
            type: "list",
            order: 3,
            listType: "unordered",
            items: [
              "Проверьте уровень всех жидкостей",
              "Осмотрите тормозные колодки и диски",
              "Проверьте давление в шинах",
              "Убедитесь, что болты колес затянуты правильно",
            ],
          },
          {
            id: "safety-heading",
            type: "heading",
            order: 4,
            content: "Безопасность",
            level: "3",
          },
          {
            id: "safety-list",
            type: "list",
            order: 5,
            listType: "unordered",
            items: [
              "Снимите все незакрепленные предметы из салона",
              "Проверьте надежность крепления аккумулятора",
              "Убедитесь, что ремни безопасности в хорошем состоянии",
            ],
          },
          {
            id: "supplies-heading",
            type: "heading",
            order: 6,
            content: "Расходники",
            level: "3",
          },
          {
            id: "supplies-list",
            type: "list",
            order: 7,
            listType: "unordered",
            items: [
              "Возьмите запасное масло и тормозную жидкость",
              "Приготовьте набор инструментов",
              "Возьмите запасные тормозные колодки",
            ],
          },
          {
            id: "personal-prep-heading",
            type: "heading",
            order: 8,
            content: "Личная подготовка",
            level: "2",
          },
          {
            id: "gear-heading",
            type: "heading",
            order: 9,
            content: "Экипировка",
            level: "3",
          },
          {
            id: "gear-list",
            type: "list",
            order: 10,
            listType: "unordered",
            items: [
              "Шлем (обязательно!)",
              "Закрытая обувь",
              "Длинные брюки и рубашка с длинным рукавом",
              "Перчатки",
            ],
          },
          {
            id: "docs-heading",
            type: "heading",
            order: 11,
            content: "Документы",
            level: "3",
          },
          {
            id: "docs-list",
            type: "list",
            order: 12,
            listType: "unordered",
            items: [
              "Водительское удостоверение",
              "Техпаспорт автомобиля",
              "Страховка",
            ],
          },
          {
            id: "ontrack-heading",
            type: "heading",
            order: 13,
            content: "На треке",
            level: "2",
          },
          {
            id: "ontrack-list",
            type: "list",
            order: 14,
            listType: "unordered",
            items: [
              "Приезжайте заранее для регистрации",
              "Пройдите брифинг для новичков",
              "Начинайте с медленных кругов для разогрева",
              "Слушайте инструкторов",
              "Не стесняйтесь задавать вопросы",
            ],
          },
          {
            id: "conclusion-callout",
            type: "callout",
            order: 15,
            title: "Помните",
            content: "Цель первого трек-дня - научиться правильной траектории и базовым техникам, а не установить рекорд круга!",
            variant: "warning",
          },
        ],
      }),
      published: true,
      publishedAt: new Date("2024-02-01"),
      views: 2103,
      categoryId: ringCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop",
      tags: ["guides", "safety", "technique"],
    },
    {
      title: "Интервью с чемпионом RDS: секреты успеха в дрифте",
      slug: "rds-champion-interview",
      excerpt: "Эксклюзивное интервью с победителем российской дрифт серии о тренировках, настройке автомобиля и психологии",
      content: JSON.stringify({
        version: "1.0",
        blocks: [
          {
            id: "intro",
            type: "paragraph",
            order: 0,
            content: "Мы встретились с Александром Грачевым, чемпионом Russian Drift Series 2023 года, чтобы узнать о его пути к вершине российского дрифта.",
          },
          {
            id: "q1",
            type: "heading",
            order: 1,
            content: "JEMSO: Александр, расскажи, как ты начал заниматься дрифтом?",
            level: "3",
          },
          {
            id: "a1",
            type: "quote",
            order: 2,
            content: "Все началось лет 10 назад, когда я впервые увидел дрифт-шоу. Меня поразило, как пилоты контролируют машину в заносе. Купил старую BMW E36, установил welded diff и начал учиться на пустых парковках.",
            author: "Александр Грачев",
          },
          {
            id: "q2",
            type: "heading",
            order: 3,
            content: "JEMSO: Что самое сложное в дрифте?",
            level: "3",
          },
          {
            id: "a2",
            type: "quote",
            order: 4,
            content: "Многие думают, что это физика и техника, но на самом деле самое сложное - это психология. Когда ты едешь в паре, нужно одновременно контролировать свою машину, следить за соперником, реагировать на его действия. Это требует огромной концентрации.",
            author: "Александр Грачев",
          },
          {
            id: "q3",
            type: "heading",
            order: 5,
            content: "JEMSO: Какие модификации критичны для соревновательного дрифта?",
            level: "3",
          },
          {
            id: "a3",
            type: "quote",
            order: 6,
            content: "На соревновательном уровне важна надежность. У меня был случай, когда в квалификации порвался шланг интеркулера - и всё, выступление закончилось. Поэтому я всегда говорю: сначала надежность, потом мощность. Конечно, нужен мощный двигатель (минимум 400-500 л.с.), хороший LSD, правильная геометрия подвески.",
            author: "Александр Грачев",
          },
          {
            id: "image-1",
            type: "image",
            order: 7,
            src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=600&fit=crop",
            alt: "Александр Грачев на треке",
            caption: "Александр Грачев на Russian Drift Series",
            alignment: "center",
          },
          {
            id: "q4",
            type: "heading",
            order: 8,
            content: "JEMSO: Совет для начинающих дрифтеров?",
            level: "3",
          },
          {
            id: "a4",
            type: "quote",
            order: 9,
            content: "Не гонитесь за мощностью! Начинайте с небольшой машины - 200-250 л.с. вполне достаточно, чтобы научиться базовой технике. И обязательно найдите опытного наставника или запишитесь в дрифт-школу. Это сэкономит вам годы и деньги.",
            author: "Александр Грачев",
          },
          {
            id: "cta",
            type: "cta",
            order: 10,
            title: "Хотите научиться дрифту?",
            description: "Запишитесь в дрифт-школу JEMSO и получите скидку 20% на первое занятие",
            buttonText: "Записаться на обучение",
            buttonUrl: "/drift",
            alignment: "center",
          },
        ],
      }),
      published: true,
      publishedAt: new Date("2024-02-10"),
      views: 3421,
      categoryId: driftCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=600&fit=crop",
      tags: ["interviews", "competitions", "technique"],
    },
    {
      title: "JEMSO Club: итоги встречи февраля 2024",
      slug: "jemso-club-february-2024-meetup",
      excerpt: "Более 50 участников, интересные автомобили и отличная атмосфера - отчет о февральской встрече клуба",
      content: JSON.stringify({
        version: "1.0",
        blocks: [
          {
            id: "intro",
            type: "paragraph",
            order: 0,
            content: '18 февраля состоялась очередная встреча автомобильного клуба JEMSO. Несмотря на морозную погоду, более 50 энтузиастов собрались на парковке торгового центра "Мега", чтобы пообщаться, обменяться опытом и просто провести время среди единомышленников.',
          },
          {
            id: "highlights-heading",
            type: "heading",
            order: 1,
            content: "Highlights встречи",
            level: "2",
          },
          {
            id: "cars-heading",
            type: "heading",
            order: 2,
            content: "Автомобили месяца",
            level: "3",
          },
          {
            id: "cars-intro",
            type: "paragraph",
            order: 3,
            content: "На этот раз нас порадовали несколько интересных проектов:",
          },
          {
            id: "cars-list",
            type: "list",
            order: 4,
            listType: "unordered",
            items: [
              "<strong>Toyota Supra A80</strong> с двигателем 2JZ-GTE на 650 л.с. - владелец Дмитрий рассказал о процессе постройки и поделился опытом настройки турбины",
              "<strong>Nissan Silvia S15</strong> в дрифт-спеке - свежий импорт из Японии с оригинальным пробегом всего 89 000 км",
              "<strong>BMW E46 M3</strong> в Ring-конфигурации - владелец активно участвует в трек-днях и делится своим опытом",
            ],
          },
          {
            id: "image-1",
            type: "image",
            order: 5,
            src: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=600&fit=crop",
            alt: "Встреча клуба JEMSO",
            caption: "Участники февральской встречи JEMSO Club",
            alignment: "center",
          },
          {
            id: "tech-talks-heading",
            type: "heading",
            order: 6,
            content: "Технические доклады",
            level: "3",
          },
          {
            id: "tech-talks-desc",
            type: "paragraph",
            order: 7,
            content: "Наш постоянный участник и механик Сергей провел мини-лекцию о подготовке автомобиля к сезону:",
          },
          {
            id: "tech-talks-list",
            type: "list",
            order: 8,
            listType: "unordered",
            items: [
              "Замена технических жидкостей",
              "Проверка тормозной системы",
              "Диагностика подвески",
              "Подготовка к техосмотру",
            ],
          },
          {
            id: "plans-heading",
            type: "heading",
            order: 9,
            content: "Планы на сезон 2024",
            level: "3",
          },
          {
            id: "plans-desc",
            type: "paragraph",
            order: 10,
            content: "Обсудили календарь мероприятий клуба:",
          },
          {
            id: "plans-list",
            type: "list",
            order: 11,
            listType: "unordered",
            items: [
              "Март - выезд на картинг",
              "Апрель - открытие сезона трек-дней",
              "Май - совместная поездка на Moscow Raceway",
              "Июнь - летний караван в горы",
            ],
          },
          {
            id: "join-cta",
            type: "cta",
            order: 12,
            title: "Присоединяйтесь!",
            description: "Встречи клуба JEMSO проходят каждое третье воскресенье месяца. Следите за анонсами в нашем Telegram-канале. Участие бесплатное, приветствуются все марки и модели автомобилей!",
            buttonText: "Подробнее о клубе",
            buttonUrl: "/club",
            alignment: "center",
          },
        ],
      }),
      published: true,
      publishedAt: new Date("2024-02-19"),
      views: 892,
      categoryId: clubCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=600&fit=crop",
      tags: ["news", "club"],
    },
    {
      title: "Выбор первого дрифт-кара: BMW vs Nissan",
      slug: "first-drift-car-bmw-vs-nissan",
      excerpt: "Сравниваем два самых популярных варианта для начинающих дрифтеров: BMW E46 и Nissan Silvia S14",
      content: JSON.stringify({
        version: "1.0",
        blocks: [
          {
            id: "intro",
            type: "paragraph",
            order: 0,
            content: "Выбор первого дрифт-кара - важное решение, которое влияет на скорость обучения и бюджет. Рассмотрим два самых популярных варианта.",
          },
          {
            id: "bmw-heading",
            type: "heading",
            order: 1,
            content: "BMW E46 (1998-2006)",
            level: "2",
          },
          {
            id: "bmw-pros-heading",
            type: "heading",
            order: 2,
            content: "Плюсы",
            level: "3",
          },
          {
            id: "bmw-pros-list",
            type: "list",
            order: 3,
            listType: "unordered",
            items: [
              "Доступность запчастей",
              "Надежный рядный 6-цилиндровый двигатель",
              "Хорошая развесовка (50/50)",
              "Большое комьюнити и база знаний",
            ],
          },
          {
            id: "bmw-cons-heading",
            type: "heading",
            order: 4,
            content: "Минусы",
            level: "3",
          },
          {
            id: "bmw-cons-list",
            type: "list",
            order: 5,
            listType: "unordered",
            items: [
              "Больший вес (около 1400 кг)",
              "Дорогой ремонт при серьезных поломках",
              "Часто требует замены подшипников ступиц и сайлентблоков",
            ],
          },
          {
            id: "bmw-budget-heading",
            type: "heading",
            order: 6,
            content: "Бюджет",
            level: "3",
          },
          {
            id: "bmw-budget-list",
            type: "list",
            order: 7,
            listType: "unordered",
            items: [
              "Покупка: 400-600 тысяч рублей",
              "Подготовка: 200-300 тысяч рублей",
              "<strong>Итого: 600-900 тысяч рублей</strong>",
            ],
          },
          {
            id: "separator-1",
            type: "separator",
            order: 8,
            style: "solid",
          },
          {
            id: "nissan-heading",
            type: "heading",
            order: 9,
            content: "Nissan Silvia S14 (1993-1998)",
            level: "2",
          },
          {
            id: "nissan-pros-heading",
            type: "heading",
            order: 10,
            content: "Плюсы",
            level: "3",
          },
          {
            id: "nissan-pros-list",
            type: "list",
            order: 11,
            listType: "unordered",
            items: [
              "Меньший вес (около 1200 кг)",
              'Двигатель SR20DET с большим тюнинг-потенциалом',
              '"Правильная" дрифт-геометрия из коробки',
              "Культовый статус в дрифт-культуре",
            ],
          },
          {
            id: "nissan-cons-heading",
            type: "heading",
            order: 12,
            content: "Минусы",
            level: "3",
          },
          {
            id: "nissan-cons-list",
            type: "list",
            order: 13,
            listType: "unordered",
            items: [
              "Дороже в покупке",
              "Запчасти нужно заказывать",
              "Правый руль (не всем удобно)",
              "Возраст автомобилей (часто требуют восстановления)",
            ],
          },
          {
            id: "nissan-budget-heading",
            type: "heading",
            order: 14,
            content: "Бюджет",
            level: "3",
          },
          {
            id: "nissan-budget-list",
            type: "list",
            order: 15,
            listType: "unordered",
            items: [
              "Покупка: 800-1200 тысяч рублей",
              "Подготовка: 200-300 тысяч рублей",
              "<strong>Итого: 1000-1500 тысяч рублей</strong>",
            ],
          },
          {
            id: "separator-2",
            type: "separator",
            order: 16,
            style: "solid",
          },
          {
            id: "verdict-heading",
            type: "heading",
            order: 17,
            content: "Вердикт",
            level: "2",
          },
          {
            id: "verdict-callout",
            type: "callout",
            order: 18,
            title: "Наша рекомендация",
            content: 'Для новичка с ограниченным бюджетом лучше выбрать BMW E46. Если же бюджет позволяет и хочется "настоящий" дрифт-кар с историей - Nissan Silvia будет отличным выбором. Главное - не гнаться за мощностью на первых этапах!',
            variant: "success",
          },
        ],
      }),
      published: true,
      publishedAt: new Date("2024-02-25"),
      views: 4231,
      categoryId: driftCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=600&fit=crop",
      tags: ["guides", "cars", "tuning"],
    },
  ];

  const createdPosts = [];
  for (const post of blogPosts) {
    const { tags: postTags, ...postData } = post;
    const createdPost = await prisma.blogPost.upsert({
      where: { slug: postData.slug },
      update: {},
      create: postData,
    });
    createdPosts.push({ post: createdPost, tags: postTags });
  }
  console.log(`✅ Created ${blogPosts.length} blog posts`);

  // Associate tags with posts
  console.log("Associating tags with posts...");
  for (const { post, tags: tagSlugs } of createdPosts) {
    for (const tagSlug of tagSlugs) {
      const tag = createdTags.find(t => t.slug === tagSlug);
      if (tag) {
        await prisma.blogPostTag.upsert({
          where: {
            postId_tagId: {
              postId: post.id,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            postId: post.id,
            tagId: tag.id,
          },
        });
      }
    }
  }
  console.log(`✅ Associated tags with posts`);

  // Create events
  console.log("Creating events...");

  const events = [
    {
      title: "Открытие дрифт-сезона 2024",
      slug: "drift-season-opening-2024",
      excerpt: "Первое соревнование сезона на автодроме ADM Raceway",
      content: JSON.stringify({
        version: "1.0",
        blocks: [
          {
            id: "intro",
            type: "paragraph",
            order: 0,
            content: "Приглашаем всех любителей дрифта на открытие сезона 2024!",
          },
          {
            id: "program-heading",
            type: "heading",
            order: 1,
            content: "Программа мероприятия",
            level: "2",
          },
          {
            id: "time-1",
            type: "heading",
            order: 2,
            content: "10:00 - Регистрация участников",
            level: "3",
          },
          {
            id: "desc-1",
            type: "paragraph",
            order: 3,
            content: "Административные проверки, технический осмотр автомобилей",
          },
          {
            id: "time-2",
            type: "heading",
            order: 4,
            content: "11:00 - Квалификация",
            level: "3",
          },
          {
            id: "desc-2",
            type: "paragraph",
            order: 5,
            content: "Одиночные заезды для определения сетки пар",
          },
          {
            id: "time-3",
            type: "heading",
            order: 6,
            content: "14:00 - Парные заезды",
            level: "3",
          },
          {
            id: "desc-3",
            type: "paragraph",
            order: 7,
            content: "Основные соревнования в формате битв один на один",
          },
          {
            id: "time-4",
            type: "heading",
            order: 8,
            content: "17:00 - Финалы и награждение",
            level: "3",
          },
          {
            id: "desc-4",
            type: "paragraph",
            order: 9,
            content: "Определение победителей и торжественное награждение",
          },
          {
            id: "requirements-heading",
            type: "heading",
            order: 10,
            content: "Требования к участникам",
            level: "2",
          },
          {
            id: "requirements-list",
            type: "list",
            order: 11,
            listType: "unordered",
            items: [
              "Спортивная лицензия или лицензия начинающего",
              "Технически исправный автомобиль",
              "Шлем (можно взять в аренду на месте)",
              "Опыт дрифта приветствуется, но не обязателен",
            ],
          },
          {
            id: "spectators-callout",
            type: "callout",
            order: 12,
            title: "Для зрителей",
            content: "Зрители приветствуются! Вход свободный.",
            variant: "info",
          },
        ],
      }),
      published: true,
      publishedAt: new Date("2024-03-01"),
      views: 2156,
      startDate: new Date("2024-04-15T10:00:00"),
      endDate: new Date("2024-04-15T18:00:00"),
      location: "ADM Raceway, Московская область",
      locationUrl: "https://maps.google.com/?q=ADM+Raceway",
      maxParticipants: 40,
      price: 5000,
      currency: "RUB",
      categoryId: driftCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1547038577-e4887ac57f10?w=1200&h=600&fit=crop",
    },
    {
      title: "Drag Racing Championship - 1 этап",
      slug: "drag-racing-championship-stage-1",
      excerpt: "Первый этап чемпионата России по дрэг-рейсингу",
      content: JSON.stringify({
        version: "1.0",
        blocks: [
          {
            id: "intro",
            type: "paragraph",
            order: 0,
            content: "Russian Drag Racing Championship открывает сезон 2024!",
          },
          {
            id: "classes-heading",
            type: "heading",
            order: 1,
            content: "Классы участников",
            level: "2",
          },
          {
            id: "street-heading",
            type: "heading",
            order: 2,
            content: "Street Class",
            level: "3",
          },
          {
            id: "street-desc",
            type: "paragraph",
            order: 3,
            content: "Дорожные автомобили с минимальными модификациями",
          },
          {
            id: "street-list",
            type: "list",
            order: 4,
            listType: "unordered",
            items: [
              "До 400 л.с.",
              "Дорожная резина",
              "Полный интерьер",
            ],
          },
          {
            id: "prostreet-heading",
            type: "heading",
            order: 5,
            content: "Pro Street",
            level: "3",
          },
          {
            id: "prostreet-list",
            type: "list",
            order: 6,
            listType: "unordered",
            items: [
              "До 800 л.с.",
              "Слики разрешены",
              "Каркас безопасности обязателен",
            ],
          },
          {
            id: "promod-heading",
            type: "heading",
            order: 7,
            content: "Pro Modified",
            level: "3",
          },
          {
            id: "promod-list",
            type: "list",
            order: 8,
            listType: "unordered",
            items: [
              "Без ограничений по мощности",
              "Специализированные дрэг-кары",
              "Профессиональные пилоты",
            ],
          },
          {
            id: "schedule-heading",
            type: "heading",
            order: 9,
            content: "Расписание",
            level: "2",
          },
          {
            id: "friday-heading",
            type: "heading",
            order: 10,
            content: "Пятница, 10 мая",
            level: "3",
          },
          {
            id: "friday-list",
            type: "list",
            order: 11,
            listType: "unordered",
            items: ["14:00-20:00 - Свободные заезды и тренировки"],
          },
          {
            id: "saturday-heading",
            type: "heading",
            order: 12,
            content: "Суббота, 11 мая",
            level: "3",
          },
          {
            id: "saturday-list",
            type: "list",
            order: 13,
            listType: "unordered",
            items: [
              "10:00-12:00 - Квалификация Street Class",
              "13:00-15:00 - Квалификация Pro Street",
              "16:00-18:00 - Квалификация Pro Modified",
            ],
          },
          {
            id: "sunday-heading",
            type: "heading",
            order: 14,
            content: "Воскресенье, 12 мая",
            level: "3",
          },
          {
            id: "sunday-list",
            type: "list",
            order: 15,
            listType: "unordered",
            items: [
              "10:00 - Начало элиминаций",
              "16:00 - Финалы",
              "17:00 - Награждение",
            ],
          },
          {
            id: "registration-callout",
            type: "callout",
            order: 16,
            title: "Регистрация",
            content: "Регистрация открыта до 1 мая на сайте RDRC.",
            variant: "warning",
          },
        ],
      }),
      published: true,
      publishedAt: new Date("2024-03-10"),
      views: 1834,
      startDate: new Date("2024-05-10T14:00:00"),
      endDate: new Date("2024-05-12T18:00:00"),
      location: "Moscow Raceway, Волоколамское шоссе",
      locationUrl: "https://maps.google.com/?q=Moscow+Raceway",
      maxParticipants: 120,
      price: 15000,
      currency: "RUB",
      categoryId: dragCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&h=600&fit=crop",
    },
    {
      title: "Track Day для начинающих",
      slug: "beginners-track-day-may-2024",
      excerpt: "Специальный трек-день для новичков с инструкторами",
      content: JSON.stringify({
        version: "1.0",
        blocks: [
          {
            id: "intro",
            type: "paragraph",
            order: 0,
            content: "Первый раз на треке? Этот трек-день специально для вас!",
          },
          {
            id: "included-heading",
            type: "heading",
            order: 1,
            content: "Что включено",
            level: "2",
          },
          {
            id: "theory-heading",
            type: "heading",
            order: 2,
            content: "Теоретическая часть (1 час)",
            level: "3",
          },
          {
            id: "theory-list",
            type: "list",
            order: 3,
            listType: "unordered",
            items: [
              "Правила безопасности на треке",
              "Правильная траектория",
              "Техника прохождения поворотов",
              "Работа с тормозами",
            ],
          },
          {
            id: "practice-heading",
            type: "heading",
            order: 4,
            content: "Практические занятия (4 часа)",
            level: "3",
          },
          {
            id: "practice-list",
            type: "list",
            order: 5,
            listType: "unordered",
            items: [
              "Персональный инструктор в вашем автомобиле",
              "4 сессии по 20 минут",
              "Разбор ошибок после каждой сессии",
              "Видеоанализ прохождения круга",
            ],
          },
          {
            id: "additional-heading",
            type: "heading",
            order: 6,
            content: "Дополнительно",
            level: "3",
          },
          {
            id: "additional-list",
            type: "list",
            order: 7,
            listType: "unordered",
            items: [
              "Кофе-брейк",
              "Обед",
              "Видеозапись ваших заездов",
              "Сертификат участника",
            ],
          },
          {
            id: "requirements-heading",
            type: "heading",
            order: 8,
            content: "Требования",
            level: "2",
          },
          {
            id: "requirements-list",
            type: "list",
            order: 9,
            listType: "unordered",
            items: [
              "Технически исправный автомобиль",
              "Водительский стаж от 1 года",
              "Желание учиться!",
            ],
          },
          {
            id: "spots-callout",
            type: "callout",
            order: 10,
            title: "Важно",
            content: "Количество мест ограничено - 20 участников.",
            variant: "warning",
          },
          {
            id: "cta",
            type: "cta",
            order: 11,
            title: "Не упустите возможность!",
            description: "Запишитесь на трек-день прямо сейчас",
            buttonText: "Зарегистрироваться",
            buttonUrl: "/events/beginners-track-day-may-2024",
            alignment: "center",
          },
        ],
      }),
      published: true,
      publishedAt: new Date("2024-03-15"),
      views: 1456,
      startDate: new Date("2024-05-25T09:00:00"),
      endDate: new Date("2024-05-25T17:00:00"),
      location: "Смоленское кольцо, Смоленская область",
      locationUrl: "https://maps.google.com/?q=Smolensk+Ring",
      maxParticipants: 20,
      price: 12000,
      currency: "RUB",
      categoryId: ringCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&h=600&fit=crop",
    },
    {
      title: "JEMSO Summer Meet 2024",
      slug: "jemso-summer-meet-2024",
      excerpt: "Летняя встреча клуба с шоу-программой, BBQ и розыгрышем призов",
      content: JSON.stringify({
        version: "1.0",
        blocks: [
          {
            id: "intro",
            type: "paragraph",
            order: 0,
            content: "Самое масштабное мероприятие клуба в году!",
          },
          {
            id: "program-heading",
            type: "heading",
            order: 1,
            content: "Программа",
            level: "2",
          },
          {
            id: "time-1",
            type: "heading",
            order: 2,
            content: "12:00 - Открытие",
            level: "3",
          },
          {
            id: "desc-1",
            type: "paragraph",
            order: 3,
            content: "Регистрация участников, размещение автомобилей",
          },
          {
            id: "time-2",
            type: "heading",
            order: 4,
            content: "13:00 - Конкурс автомобилей",
            level: "3",
          },
          {
            id: "contest-list",
            type: "list",
            order: 5,
            listType: "unordered",
            items: [
              "Лучший дрифт-кар",
              "Лучший драг-кар",
              "Лучший шоу-кар",
              "Народный выбор",
            ],
          },
          {
            id: "time-3",
            type: "heading",
            order: 6,
            content: "15:00 - BBQ и общение",
            level: "3",
          },
          {
            id: "desc-3",
            type: "paragraph",
            order: 7,
            content: "Отличная еда и напитки в неформальной обстановке",
          },
          {
            id: "time-4",
            type: "heading",
            order: 8,
            content: "17:00 - Демонстрационные заезды",
            level: "3",
          },
          {
            id: "desc-4",
            type: "paragraph",
            order: 9,
            content: "Показательные выступления профессиональных пилотов",
          },
          {
            id: "time-5",
            type: "heading",
            order: 10,
            content: "19:00 - Розыгрыш призов",
            level: "3",
          },
          {
            id: "prizes-desc",
            type: "paragraph",
            order: 11,
            content: "Ценные призы от спонсоров:",
          },
          {
            id: "prizes-list",
            type: "list",
            order: 12,
            listType: "unordered",
            items: [
              "Комплект спортивных тормозных колодок",
              "Сертификаты на услуги сервисов",
              "Мерч JEMSO",
            ],
          },
          {
            id: "time-6",
            type: "heading",
            order: 13,
            content: "20:00 - After-party",
            level: "3",
          },
          {
            id: "desc-6",
            type: "paragraph",
            order: 14,
            content: "Продолжение в неформальной обстановке",
          },
          {
            id: "separator",
            type: "separator",
            order: 15,
            style: "solid",
          },
          {
            id: "participation-heading",
            type: "heading",
            order: 16,
            content: "Участие",
            level: "2",
          },
          {
            id: "pricing-list",
            type: "list",
            order: 17,
            listType: "unordered",
            items: [
              "<strong>Для членов клуба:</strong> бесплатно",
              "<strong>Гости:</strong> 1000 рублей",
              "<strong>Участие автомобиля в конкурсе:</strong> бесплатно",
            ],
          },
          {
            id: "welcome-callout",
            type: "callout",
            order: 18,
            title: "Приглашаются все!",
            content: "Приглашаются все энтузиасты, независимо от марки и модели автомобиля!",
            variant: "success",
          },
        ],
      }),
      published: true,
      publishedAt: new Date("2024-04-01"),
      views: 3421,
      startDate: new Date("2024-07-06T12:00:00"),
      endDate: new Date("2024-07-06T22:00:00"),
      location: "Парк Патриот, Московская область",
      locationUrl: "https://maps.google.com/?q=Park+Patriot+Moscow",
      maxParticipants: null, // unlimited
      price: 0,
      currency: "RUB",
      categoryId: clubCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=600&fit=crop",
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
  }
  console.log(`✅ Created ${events.length} events`);

  // Create newsletter subscribers
  console.log("Creating newsletter subscribers...");

  const subscribers = [
    { email: "ivan.petrov@example.com", name: "Иван Петров", active: true, confirmedAt: new Date() },
    { email: "anna.sidorova@example.com", name: "Анна Сидорова", active: true, confirmedAt: new Date() },
    { email: "dmitry.kozlov@example.com", name: "Дмитрий Козлов", active: true, confirmedAt: new Date() },
    { email: "elena.volkova@example.com", name: "Елена Волкова", active: true, confirmedAt: new Date() },
    { email: "alex.smirnov@example.com", name: "Александр Смирнов", active: true, confirmedAt: new Date() },
  ];

  for (const subscriber of subscribers) {
    await prisma.newsletterSubscriber.upsert({
      where: { email: subscriber.email },
      update: {},
      create: subscriber,
    });
  }
  console.log(`✅ Created ${subscribers.length} newsletter subscribers`);

  // Create some comments
  console.log("Creating comments...");

  const firstPost = createdPosts[0]?.post;
  if (firstPost) {
    const comments = [
      {
        content: "Отличная статья! Особенно про LSD - многие недооценивают важность хорошего дифференциала.",
        approved: true,
        postId: firstPost.id,
        authorId: adminUser.id,
      },
      {
        content: "А какой LSD посоветуете для BMW E46? Cusco или все-таки OS Giken?",
        approved: true,
        postId: firstPost.id,
        authorId: adminUser.id,
      },
      {
        content: "Про гидроручник согласен на 100%. Без него в дрифте делать нечего.",
        approved: true,
        postId: firstPost.id,
        authorId: adminUser.id,
      },
    ];

    for (const comment of comments) {
      await prisma.comment.create({
        data: comment,
      });
    }
    console.log(`✅ Created ${comments.length} comments`);
  }

  console.log("✅ Database seeded successfully with mock data!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });

