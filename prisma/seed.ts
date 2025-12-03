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

  // Create supported languages
  console.log("Creating languages...");
  
  const languages = [
    { code: "ru", name: "Russian", nativeName: "Русский", isDefault: true, isActive: true, order: 1 },
    { code: "en", name: "English", nativeName: "English", isDefault: false, isActive: true, order: 2 },
  ];

  for (const language of languages) {
    await prisma.language.upsert({
      where: { code: language.code },
      update: {},
      create: language,
    });
  }
  console.log(`✅ Created ${languages.length} languages`);

  // Create basic permissions
  const permissions = [
    // Blog permissions
    { name: "Create Blog Post", slug: "blog_post-create", resource: "blog_post", action: "create" },
    { name: "Read Blog Post", slug: "blog_post-read", resource: "blog_post", action: "read" },
    { name: "Update Blog Post", slug: "blog_post-update", resource: "blog_post", action: "update" },
    { name: "Delete Blog Post", slug: "blog_post-delete", resource: "blog_post", action: "delete" },
    // News permissions
    { name: "Create News", slug: "news-create", resource: "news", action: "create" },
    { name: "Read News", slug: "news-read", resource: "news", action: "read" },
    { name: "Update News", slug: "news-update", resource: "news", action: "update" },
    { name: "Delete News", slug: "news-delete", resource: "news", action: "delete" },
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
    "news-create",
    "news-read",
    "news-update",
    "news-delete",
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
    "news-create",
    "news-read",
    "news-update",
    "news-delete",
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
    "news-create",
    "news-read",
    "news-update",
    "news-delete",
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
    { name: "Доступ к базовым событиям", slug: "basic-events-access", featureType: "boolean", defaultLocale: "ru", translations: { en: { name: "Basic Events Access" } } },
    { name: "Доступ к премиум событиям", slug: "premium-events-access", featureType: "boolean", defaultLocale: "ru", translations: { en: { name: "Premium Events Access" } } },
    { name: "Доступ к закрытым событиям", slug: "private-events-access", featureType: "boolean", defaultLocale: "ru", translations: { en: { name: "Private Events Access" } } },
    { name: "Ранний доступ к регистрации", slug: "early-registration", featureType: "boolean", defaultLocale: "ru", translations: { en: { name: "Early Registration Access" } } },
    { name: "Бесплатный гость +1", slug: "free-guest", featureType: "boolean", defaultLocale: "ru", translations: { en: { name: "Free Guest +1" } } },
    { name: "Цифровые фото с мероприятий", slug: "event-photos", featureType: "boolean", defaultLocale: "ru", translations: { en: { name: "Digital Event Photos" } } },
    { name: "Скидка на участие", slug: "event-discount", featureType: "numeric", defaultLocale: "ru", translations: { en: { name: "Participation Discount" } } },
    { name: "Доступ к дрифт-школе", slug: "drift-school-access", featureType: "boolean", defaultLocale: "ru", translations: { en: { name: "Drift School Access" } } },
    { name: "Персональный инструктор", slug: "personal-instructor", featureType: "boolean", defaultLocale: "ru", translations: { en: { name: "Personal Instructor" } } },
    { name: "Приоритетная поддержка", slug: "priority-support", featureType: "boolean", defaultLocale: "ru", translations: { en: { name: "Priority Support" } } },
    { name: "Доступ к закрытому клубу", slug: "exclusive-club-access", featureType: "boolean", defaultLocale: "ru", translations: { en: { name: "Exclusive Club Access" } } },
    { name: "Фирменный мерч", slug: "branded-merch", featureType: "boolean", defaultLocale: "ru", translations: { en: { name: "Branded Merchandise" } } },
    { name: "VIP парковка", slug: "vip-parking", featureType: "boolean", defaultLocale: "ru", translations: { en: { name: "VIP Parking" } } },
    { name: "Количество мероприятий в месяц", slug: "monthly-events-limit", featureType: "numeric", defaultLocale: "ru", translations: { en: { name: "Monthly Events Limit" } } },
  ];

  for (const feature of features) {
    await prisma.feature.upsert({
      where: { slug: feature.slug },
      update: { translations: feature.translations },
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
      defaultLocale: "ru",
      translations: {
        en: {
          name: "Drift",
          description: "A motorsport discipline where the main goal is to control the car while sliding at high speeds",
        },
      },
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
      defaultLocale: "ru",
      translations: {
        en: {
          name: "Drag",
          description: "Straight-line racing where the winner is the first to cross the finish line",
        },
      },
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
      defaultLocale: "ru",
      translations: {
        en: {
          name: "Circuit Racing",
          description: "Circuit racing on specialized tracks with turns of varying difficulty",
        },
      },
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
      defaultLocale: "ru",
      translations: {
        en: {
          name: "Club",
          description: "JEMSO Car Club - meetups, events and networking with like-minded enthusiasts",
        },
      },
    },
  ];

  for (const category of racingCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { translations: category.translations },
      create: category,
    });
  }

  console.log(`✅ Created ${racingCategories.length} racing categories`);

  // Create subscription plans
  console.log("Creating subscription plans...");

  const basicPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: "basic" },
    update: {
      translations: {
        en: {
          name: "Basic",
          description: "Entry level for getting acquainted with the world of motorsport",
        },
      },
    },
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
      defaultLocale: "ru",
      translations: {
        en: {
          name: "Basic",
          description: "Entry level for getting acquainted with the world of motorsport",
        },
      },
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
    update: {
      translations: {
        en: {
          name: "Advanced",
          description: "For active participants with access to premium events and drift school",
        },
      },
    },
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
      defaultLocale: "ru",
      translations: {
        en: {
          name: "Advanced",
          description: "For active participants with access to premium events and drift school",
        },
      },
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
    update: {
      translations: {
        en: {
          name: "VIP",
          description: "Maximum level with access to all privileges and exclusive events",
        },
      },
    },
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
      defaultLocale: "ru",
      translations: {
        en: {
          name: "VIP",
          description: "Maximum level with access to all privileges and exclusive events",
        },
      },
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
    { name: "Тюнинг", slug: "tuning", defaultLocale: "ru", translations: { en: { name: "Tuning" } } },
    { name: "Техника", slug: "technique", defaultLocale: "ru", translations: { en: { name: "Technique" } } },
    { name: "Новости", slug: "news", defaultLocale: "ru", translations: { en: { name: "News" } } },
    { name: "Обзоры", slug: "reviews", defaultLocale: "ru", translations: { en: { name: "Reviews" } } },
    { name: "Гайды", slug: "guides", defaultLocale: "ru", translations: { en: { name: "Guides" } } },
    { name: "Интервью", slug: "interviews", defaultLocale: "ru", translations: { en: { name: "Interviews" } } },
    { name: "Соревнования", slug: "competitions", defaultLocale: "ru", translations: { en: { name: "Competitions" } } },
    { name: "Автомобили", slug: "cars", defaultLocale: "ru", translations: { en: { name: "Cars" } } },
    { name: "Запчасти", slug: "parts", defaultLocale: "ru", translations: { en: { name: "Parts" } } },
    { name: "Безопасность", slug: "safety", defaultLocale: "ru", translations: { en: { name: "Safety" } } },
  ];

  const createdTags = [];
  for (const tag of tags) {
    const createdTag = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { translations: tag.translations },
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

  // Create blog posts (Separate from News)
  console.log("Creating blog posts...");

  const blogPosts = [
    {
      title: "Топ-5 модификаций для дрифт-кара в 2024 году",
      slug: "top-5-drift-car-mods-2024",
      excerpt: "Узнайте, какие модификации помогут вывести ваш дрифт-кар на новый уровень",
      content: "<h2>1. Дифференциал повышенного трения (LSD)</h2><p>Один из самых важных элементов дрифт-кара. LSD позволяет обоим колесам вращаться с одинаковой скоростью, что критично для контролируемого заноса.</p><blockquote><p>Для начинающих дрифтеров рекомендуется LSD с коэффициентом блокировки 1.5-2 way. Более агрессивные варианты подойдут для опытных пилотов.</p></blockquote><h2>2. Гидравлический ручной тормоз</h2><p>Гидроручник - незаменимый инструмент для инициации заноса и коррекции траектории. Профессиональные дрифтеры используют его постоянно.</p><h2>3. Усиленная подвеска</h2><p>Койловеры с регулируемой жесткостью позволяют настроить баланс автомобиля под свой стиль вождения и особенности трассы.</p><h2>4. Увеличенный угол поворота передних колес</h2><p>Специальные рычаги подвески позволяют увеличить угол поворота до 60-70 градусов, что критично для больших углов заноса.</p><h2>5. Система охлаждения</h2><p>Усиленный радиатор и масляный кулер помогут поддерживать оптимальную температуру двигателя даже при экстремальных нагрузках.</p><p>Все эти модификации значительно улучшат характеристики вашего дрифт-кара и помогут достичь лучших результатов на треке.</p>",
      htmlContent: "<h2>1. Дифференциал повышенного трения (LSD)</h2><p>Один из самых важных элементов дрифт-кара. LSD позволяет обоим колесам вращаться с одинаковой скоростью, что критично для контролируемого заноса.</p><blockquote><p>Для начинающих дрифтеров рекомендуется LSD с коэффициентом блокировки 1.5-2 way. Более агрессивные варианты подойдут для опытных пилотов.</p></blockquote><h2>2. Гидравлический ручной тормоз</h2><p>Гидроручник - незаменимый инструмент для инициации заноса и коррекции траектории. Профессиональные дрифтеры используют его постоянно.</p><h2>3. Усиленная подвеска</h2><p>Койловеры с регулируемой жесткостью позволяют настроить баланс автомобиля под свой стиль вождения и особенности трассы.</p><h2>4. Увеличенный угол поворота передних колес</h2><p>Специальные рычаги подвески позволяют увеличить угол поворота до 60-70 градусов, что критично для больших углов заноса.</p><h2>5. Система охлаждения</h2><p>Усиленный радиатор и масляный кулер помогут поддерживать оптимальную температуру двигателя даже при экстремальных нагрузках.</p><p>Все эти модификации значительно улучшат характеристики вашего дрифт-кара и помогут достичь лучших результатов на треке.</p>",
      published: true,
      publishedAt: new Date("2024-01-15"),
      views: 1245,
      categoryId: driftCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&h=600&fit=crop",
      tags: ["tuning", "technique", "guides"],
      minTier: 0,
      defaultLocale: "ru",
      translations: {
        en: {
          title: "Top 5 Drift Car Modifications in 2024",
          excerpt: "Learn which modifications will take your drift car to the next level",
          content: "<h2>1. Limited Slip Differential (LSD)</h2><p>One of the most important elements of a drift car. LSD allows both wheels to rotate at the same speed, which is critical for controlled sliding.</p><blockquote><p>For beginner drifters, an LSD with a 1.5-2 way locking ratio is recommended. More aggressive options are suitable for experienced drivers.</p></blockquote><h2>2. Hydraulic Handbrake</h2><p>A hydraulic handbrake is an essential tool for initiating slides and correcting trajectory. Professional drifters use it constantly.</p><h2>3. Upgraded Suspension</h2><p>Coilovers with adjustable stiffness allow you to tune the car's balance to your driving style and track conditions.</p><h2>4. Increased Front Wheel Steering Angle</h2><p>Special suspension arms allow increasing the steering angle to 60-70 degrees, which is critical for large drift angles.</p><h2>5. Cooling System</h2><p>An upgraded radiator and oil cooler will help maintain optimal engine temperature even under extreme loads.</p><p>All these modifications will significantly improve your drift car's performance and help you achieve better results on the track.</p>",
          htmlContent: "<h2>1. Limited Slip Differential (LSD)</h2><p>One of the most important elements of a drift car. LSD allows both wheels to rotate at the same speed, which is critical for controlled sliding.</p><blockquote><p>For beginner drifters, an LSD with a 1.5-2 way locking ratio is recommended. More aggressive options are suitable for experienced drivers.</p></blockquote><h2>2. Hydraulic Handbrake</h2><p>A hydraulic handbrake is an essential tool for initiating slides and correcting trajectory. Professional drifters use it constantly.</p><h2>3. Upgraded Suspension</h2><p>Coilovers with adjustable stiffness allow you to tune the car's balance to your driving style and track conditions.</p><h2>4. Increased Front Wheel Steering Angle</h2><p>Special suspension arms allow increasing the steering angle to 60-70 degrees, which is critical for large drift angles.</p><h2>5. Cooling System</h2><p>An upgraded radiator and oil cooler will help maintain optimal engine temperature even under extreme loads.</p><p>All these modifications will significantly improve your drift car's performance and help you achieve better results on the track.</p>",
        },
      },
    },
    {
      title: "История дрэг-рейсинга: от улиц до профессиональных треков",
      slug: "drag-racing-history",
      excerpt: "Погрузитесь в увлекательную историю развития дрэг-рейсинга от подпольных гонок до международных чемпионатов",
      content: "<p>Дрэг-рейсинг зародился в США в 1940-х годах как уличные гонки на прямых участках дорог. Со временем это движение превратилось в полноценный вид автоспорта с профессиональными трассами и международными соревнованиями.</p><h2>Ранние годы (1940-1950)</h2><p>После Второй мировой войны многие демобилизованные солдаты привезли с собой опыт работы с техникой. Они начали модифицировать свои автомобили и соревноваться на заброшенных взлетных полосах.</p><h2>Профессионализация (1960-1980)</h2><p>В 1951 году была основана National Hot Rod Association (NHRA), которая стандартизировала правила и создала безопасную среду для соревнований. Появились специализированные drag strips - прямые трассы длиной четверть мили (402 метра).</p><figure><img src=\"https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&h=600&fit=crop\" alt=\"Дрэг-рейсинг трек\"><figcaption>Современная drag strip трасса</figcaption></figure><h2>Современная эра (1990-настоящее время)</h2><p>Сегодня дрэг-рейсинг - это высокотехнологичный спорт, где автомобили развивают скорость более 530 км/ч и проходят четверть мили менее чем за 4 секунды. В России дрэг-рейсинг активно развивается с начала 2000-х годов.</p>",
      htmlContent: "<p>Дрэг-рейсинг зародился в США в 1940-х годах как уличные гонки на прямых участках дорог. Со временем это движение превратилось в полноценный вид автоспорта с профессиональными трассами и международными соревнованиями.</p><h2>Ранние годы (1940-1950)</h2><p>После Второй мировой войны многие демобилизованные солдаты привезли с собой опыт работы с техникой. Они начали модифицировать свои автомобили и соревноваться на заброшенных взлетных полосах.</p><h2>Профессионализация (1960-1980)</h2><p>В 1951 году была основана National Hot Rod Association (NHRA), которая стандартизировала правила и создала безопасную среду для соревнований. Появились специализированные drag strips - прямые трассы длиной четверть мили (402 метра).</p><figure><img src=\"https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&h=600&fit=crop\" alt=\"Дрэг-рейсинг трек\"><figcaption>Современная drag strip трасса</figcaption></figure><h2>Современная эра (1990-настоящее время)</h2><p>Сегодня дрэг-рейсинг - это высокотехнологичный спорт, где автомобили развивают скорость более 530 км/ч и проходят четверть мили менее чем за 4 секунды. В России дрэг-рейсинг активно развивается с начала 2000-х годов.</p>",
      published: true,
      publishedAt: new Date("2024-01-20"),
      views: 856,
      categoryId: dragCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=600&fit=crop",
      tags: ["news", "competitions"],
      minTier: 0,
      defaultLocale: "ru",
      translations: {
        en: {
          title: "History of Drag Racing: From Streets to Professional Tracks",
          excerpt: "Dive into the fascinating history of drag racing from underground races to international championships",
          content: "<p>Drag racing originated in the USA in the 1940s as street racing on straight road sections. Over time, this movement evolved into a full-fledged motorsport with professional tracks and international competitions.</p><h2>Early Years (1940-1950)</h2><p>After World War II, many demobilized soldiers brought their mechanical experience with them. They began modifying their cars and competing on abandoned airstrips.</p><h2>Professionalization (1960-1980)</h2><p>In 1951, the National Hot Rod Association (NHRA) was founded, standardizing rules and creating a safe environment for competitions. Specialized drag strips appeared - straight tracks a quarter mile (402 meters) long.</p><h2>Modern Era (1990-present)</h2><p>Today, drag racing is a high-tech sport where cars reach speeds over 330 mph and cover a quarter mile in less than 4 seconds. In Russia, drag racing has been actively developing since the early 2000s.</p>",
          htmlContent: "<p>Drag racing originated in the USA in the 1940s as street racing on straight road sections. Over time, this movement evolved into a full-fledged motorsport with professional tracks and international competitions.</p><h2>Early Years (1940-1950)</h2><p>After World War II, many demobilized soldiers brought their mechanical experience with them. They began modifying their cars and competing on abandoned airstrips.</p><h2>Professionalization (1960-1980)</h2><p>In 1951, the National Hot Rod Association (NHRA) was founded, standardizing rules and creating a safe environment for competitions. Specialized drag strips appeared - straight tracks a quarter mile (402 meters) long.</p><h2>Modern Era (1990-present)</h2><p>Today, drag racing is a high-tech sport where cars reach speeds over 330 mph and cover a quarter mile in less than 4 seconds. In Russia, drag racing has been actively developing since the early 2000s.</p>",
        },
      },
    },
    {
      title: "Подготовка к первому трек-дню: чек-лист для начинающих",
      slug: "first-track-day-checklist",
      excerpt: "Полное руководство по подготовке автомобиля и себя к первому выезду на трек",
      content: "<p>Собираетесь на свой первый трек-день? Это захватывающий опыт, но важно правильно подготовиться. Вот полный чек-лист, который поможет вам избежать проблем и получить максимум удовольствия.</p><h2>Подготовка автомобиля</h2><h3>Технический осмотр</h3><ul><li>Проверьте уровень всех жидкостей</li><li>Осмотрите тормозные колодки и диски</li><li>Проверьте давление в шинах</li><li>Убедитесь, что болты колес затянуты правильно</li></ul><h3>Безопасность</h3><ul><li>Снимите все незакрепленные предметы из салона</li><li>Проверьте надежность крепления аккумулятора</li><li>Убедитесь, что ремни безопасности в хорошем состоянии</li></ul><h3>Расходники</h3><ul><li>Возьмите запасное масло и тормозную жидкость</li><li>Приготовьте набор инструментов</li><li>Возьмите запасные тормозные колодки</li></ul><h2>Личная подготовка</h2><h3>Экипировка</h3><ul><li>Шлем (обязательно!)</li><li>Закрытая обувь</li><li>Длинные брюки и рубашка с длинным рукавом</li><li>Перчатки</li></ul><h3>Документы</h3><ul><li>Водительское удостоверение</li><li>Техпаспорт автомобиля</li><li>Страховка</li></ul><h2>На треке</h2><ul><li>Приезжайте заранее для регистрации</li><li>Пройдите брифинг для новичков</li><li>Начинайте с медленных кругов для разогрева</li><li>Слушайте инструкторов</li><li>Не стесняйтесь задавать вопросы</li></ul><blockquote><p>Цель первого трек-дня - научиться правильной траектории и базовым техникам, а не установить рекорд круга!</p></blockquote>",
      htmlContent: "<p>Собираетесь на свой первый трек-день? Это захватывающий опыт, но важно правильно подготовиться. Вот полный чек-лист, который поможет вам избежать проблем и получить максимум удовольствия.</p><h2>Подготовка автомобиля</h2><h3>Технический осмотр</h3><ul><li>Проверьте уровень всех жидкостей</li><li>Осмотрите тормозные колодки и диски</li><li>Проверьте давление в шинах</li><li>Убедитесь, что болты колес затянуты правильно</li></ul><h3>Безопасность</h3><ul><li>Снимите все незакрепленные предметы из салона</li><li>Проверьте надежность крепления аккумулятора</li><li>Убедитесь, что ремни безопасности в хорошем состоянии</li></ul><h3>Расходники</h3><ul><li>Возьмите запасное масло и тормозную жидкость</li><li>Приготовьте набор инструментов</li><li>Возьмите запасные тормозные колодки</li></ul><h2>Личная подготовка</h2><h3>Экипировка</h3><ul><li>Шлем (обязательно!)</li><li>Закрытая обувь</li><li>Длинные брюки и рубашка с длинным рукавом</li><li>Перчатки</li></ul><h3>Документы</h3><ul><li>Водительское удостоверение</li><li>Техпаспорт автомобиля</li><li>Страховка</li></ul><h2>На треке</h2><ul><li>Приезжайте заранее для регистрации</li><li>Пройдите брифинг для новичков</li><li>Начинайте с медленных кругов для разогрева</li><li>Слушайте инструкторов</li><li>Не стесняйтесь задавать вопросы</li></ul><blockquote><p>Цель первого трек-дня - научиться правильной траектории и базовым техникам, а не установить рекорд круга!</p></blockquote>",
      published: true,
      publishedAt: new Date("2024-02-01"),
      views: 2103,
      categoryId: ringCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=1200&h=600&fit=crop",
      tags: ["guides", "safety", "technique"],
      minTier: 0,
      defaultLocale: "ru",
      translations: {
        en: {
          title: "Preparing for Your First Track Day: A Beginner's Checklist",
          excerpt: "Complete guide to preparing your car and yourself for your first track outing",
          content: "<p>Going to your first track day? It's an exciting experience, but it's important to prepare properly. Here's a complete checklist to help you avoid problems and get the most enjoyment.</p><h2>Car Preparation</h2><h3>Technical Inspection</h3><ul><li>Check all fluid levels</li><li>Inspect brake pads and discs</li><li>Check tire pressure</li><li>Make sure wheel bolts are properly tightened</li></ul><h3>Safety</h3><ul><li>Remove all loose items from the cabin</li><li>Check battery mounting security</li><li>Ensure seatbelts are in good condition</li></ul><h3>Consumables</h3><ul><li>Bring spare oil and brake fluid</li><li>Prepare a tool kit</li><li>Bring spare brake pads</li></ul><h2>Personal Preparation</h2><h3>Equipment</h3><ul><li>Helmet (mandatory!)</li><li>Closed-toe shoes</li><li>Long pants and long-sleeve shirt</li><li>Gloves</li></ul><h3>Documents</h3><ul><li>Driver's license</li><li>Vehicle registration</li><li>Insurance</li></ul><h2>At the Track</h2><ul><li>Arrive early for registration</li><li>Attend the beginner's briefing</li><li>Start with slow laps to warm up</li><li>Listen to instructors</li><li>Don't be afraid to ask questions</li></ul><blockquote><p>The goal of your first track day is to learn proper racing lines and basic techniques, not to set a lap record!</p></blockquote>",
          htmlContent: "<p>Going to your first track day? It's an exciting experience, but it's important to prepare properly. Here's a complete checklist to help you avoid problems and get the most enjoyment.</p><h2>Car Preparation</h2><h3>Technical Inspection</h3><ul><li>Check all fluid levels</li><li>Inspect brake pads and discs</li><li>Check tire pressure</li><li>Make sure wheel bolts are properly tightened</li></ul><h3>Safety</h3><ul><li>Remove all loose items from the cabin</li><li>Check battery mounting security</li><li>Ensure seatbelts are in good condition</li></ul><h3>Consumables</h3><ul><li>Bring spare oil and brake fluid</li><li>Prepare a tool kit</li><li>Bring spare brake pads</li></ul><h2>Personal Preparation</h2><h3>Equipment</h3><ul><li>Helmet (mandatory!)</li><li>Closed-toe shoes</li><li>Long pants and long-sleeve shirt</li><li>Gloves</li></ul><h3>Documents</h3><ul><li>Driver's license</li><li>Vehicle registration</li><li>Insurance</li></ul><h2>At the Track</h2><ul><li>Arrive early for registration</li><li>Attend the beginner's briefing</li><li>Start with slow laps to warm up</li><li>Listen to instructors</li><li>Don't be afraid to ask questions</li></ul><blockquote><p>The goal of your first track day is to learn proper racing lines and basic techniques, not to set a lap record!</p></blockquote>",
        },
      },
    },
    {
      title: "Интервью с чемпионом RDS: секреты успеха в дрифте",
      slug: "rds-champion-interview",
      excerpt: "Эксклюзивное интервью с победителем российской дрифт серии о тренировках, настройке автомобиля и психологии",
      content: "<p>Мы встретились с Александром Грачевым, чемпионом Russian Drift Series 2023 года, чтобы узнать о его пути к вершине российского дрифта.</p><h3>JEMSO: Александр, расскажи, как ты начал заниматься дрифтом?</h3><blockquote><p>Все началось лет 10 назад, когда я впервые увидел дрифт-шоу. Меня поразило, как пилоты контролируют машину в заносе. Купил старую BMW E36, установил welded diff и начал учиться на пустых парковках.</p><cite>Александр Грачев</cite></blockquote><h3>JEMSO: Что самое сложное в дрифте?</h3><blockquote><p>Многие думают, что это физика и техника, но на самом деле самое сложное - это психология. Когда ты едешь в паре, нужно одновременно контролировать свою машину, следить за соперником, реагировать на его действия. Это требует огромной концентрации.</p><cite>Александр Грачев</cite></blockquote><h3>JEMSO: Какие модификации критичны для соревновательного дрифта?</h3><blockquote><p>На соревновательном уровне важна надежность. У меня был случай, когда в квалификации порвался шланг интеркулера - и всё, выступление закончилось. Поэтому я всегда говорю: сначала надежность, потом мощность. Конечно, нужен мощный двигатель (минимум 400-500 л.с.), хороший LSD, правильная геометрия подвески.</p><cite>Александр Грачев</cite></blockquote><figure><img src=\"https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&h=600&fit=crop\" alt=\"Александр Грачев на треке\"><figcaption>Александр Грачев на Russian Drift Series</figcaption></figure><h3>JEMSO: Совет для начинающих дрифтеров?</h3><blockquote><p>Не гонитесь за мощностью! Начинайте с небольшой машины - 200-250 л.с. вполне достаточно, чтобы научиться базовой технике. И обязательно найдите опытного наставника или запишитесь в дрифт-школу. Это сэкономит вам годы и деньги.</p><cite>Александр Грачев</cite></blockquote>",
      htmlContent: "<p>Мы встретились с Александром Грачевым, чемпионом Russian Drift Series 2023 года, чтобы узнать о его пути к вершине российского дрифта.</p><h3>JEMSO: Александр, расскажи, как ты начал заниматься дрифтом?</h3><blockquote><p>Все началось лет 10 назад, когда я впервые увидел дрифт-шоу. Меня поразило, как пилоты контролируют машину в заносе. Купил старую BMW E36, установил welded diff и начал учиться на пустых парковках.</p><cite>Александр Грачев</cite></blockquote><h3>JEMSO: Что самое сложное в дрифте?</h3><blockquote><p>Многие думают, что это физика и техника, но на самом деле самое сложное - это психология. Когда ты едешь в паре, нужно одновременно контролировать свою машину, следить за соперником, реагировать на его действия. Это требует огромной концентрации.</p><cite>Александр Грачев</cite></blockquote><h3>JEMSO: Какие модификации критичны для соревновательного дрифта?</h3><blockquote><p>На соревновательном уровне важна надежность. У меня был случай, когда в квалификации порвался шланг интеркулера - и всё, выступление закончилось. Поэтому я всегда говорю: сначала надежность, потом мощность. Конечно, нужен мощный двигатель (минимум 400-500 л.с.), хороший LSD, правильная геометрия подвески.</p><cite>Александр Грачев</cite></blockquote><figure><img src=\"https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&h=600&fit=crop\" alt=\"Александр Грачев на треке\"><figcaption>Александр Грачев на Russian Drift Series</figcaption></figure><h3>JEMSO: Совет для начинающих дрифтеров?</h3><blockquote><p>Не гонитесь за мощностью! Начинайте с небольшой машины - 200-250 л.с. вполне достаточно, чтобы научиться базовой технике. И обязательно найдите опытного наставника или запишитесь в дрифт-школу. Это сэкономит вам годы и деньги.</p><cite>Александр Грачев</cite></blockquote>",
      published: true,
      publishedAt: new Date("2024-02-10"),
      views: 3421,
      categoryId: driftCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&h=600&fit=crop",
      tags: ["interviews", "competitions", "technique"],
      minTier: 2, // Advanced only
      defaultLocale: "ru",
      translations: {
        en: {
          title: "Interview with RDS Champion: Secrets of Drift Success",
          excerpt: "Exclusive interview with the Russian Drift Series winner about training, car setup, and psychology",
          content: "<p>We met with Alexander Grachev, the 2023 Russian Drift Series champion, to learn about his path to the top of Russian drifting.</p><h3>JEMSO: Alexander, tell us how you started drifting?</h3><blockquote><p>It all started about 10 years ago when I first saw a drift show. I was amazed at how pilots control the car while sliding. I bought an old BMW E36, installed a welded diff, and started learning in empty parking lots.</p><cite>Alexander Grachev</cite></blockquote><h3>JEMSO: What's the hardest part of drifting?</h3><blockquote><p>Many think it's physics and technique, but actually the hardest part is psychology. When you're tandem drifting, you need to simultaneously control your car, watch your opponent, and react to their actions. It requires enormous concentration.</p><cite>Alexander Grachev</cite></blockquote><h3>JEMSO: What modifications are critical for competitive drifting?</h3><blockquote><p>At the competitive level, reliability is key. I had a case when the intercooler hose broke during qualifying - and that was it, the performance was over. That's why I always say: reliability first, then power. Of course, you need a powerful engine (at least 400-500 hp), a good LSD, proper suspension geometry.</p><cite>Alexander Grachev</cite></blockquote><h3>JEMSO: Advice for beginner drifters?</h3><blockquote><p>Don't chase power! Start with a small car - 200-250 hp is quite enough to learn the basics. And definitely find an experienced mentor or enroll in a drift school. It will save you years and money.</p><cite>Alexander Grachev</cite></blockquote>",
          htmlContent: "<p>We met with Alexander Grachev, the 2023 Russian Drift Series champion, to learn about his path to the top of Russian drifting.</p><h3>JEMSO: Alexander, tell us how you started drifting?</h3><blockquote><p>It all started about 10 years ago when I first saw a drift show. I was amazed at how pilots control the car while sliding. I bought an old BMW E36, installed a welded diff, and started learning in empty parking lots.</p><cite>Alexander Grachev</cite></blockquote><h3>JEMSO: What's the hardest part of drifting?</h3><blockquote><p>Many think it's physics and technique, but actually the hardest part is psychology. When you're tandem drifting, you need to simultaneously control your car, watch your opponent, and react to their actions. It requires enormous concentration.</p><cite>Alexander Grachev</cite></blockquote><h3>JEMSO: What modifications are critical for competitive drifting?</h3><blockquote><p>At the competitive level, reliability is key. I had a case when the intercooler hose broke during qualifying - and that was it, the performance was over. That's why I always say: reliability first, then power. Of course, you need a powerful engine (at least 400-500 hp), a good LSD, proper suspension geometry.</p><cite>Alexander Grachev</cite></blockquote><h3>JEMSO: Advice for beginner drifters?</h3><blockquote><p>Don't chase power! Start with a small car - 200-250 hp is quite enough to learn the basics. And definitely find an experienced mentor or enroll in a drift school. It will save you years and money.</p><cite>Alexander Grachev</cite></blockquote>",
        },
      },
    },
    {
      title: "Выбор первого дрифт-кара: BMW vs Nissan",
      slug: "first-drift-car-bmw-vs-nissan",
      excerpt: "Сравниваем два самых популярных варианта для начинающих дрифтеров: BMW E46 и Nissan Silvia S14",
      content: "<p>Выбор первого дрифт-кара - важное решение, которое влияет на скорость обучения и бюджет. Рассмотрим два самых популярных варианта.</p><h2>BMW E46 (1998-2006)</h2><h3>Плюсы</h3><ul><li>Доступность запчастей</li><li>Надежный рядный 6-цилиндровый двигатель</li><li>Хорошая развесовка (50/50)</li><li>Большое комьюнити и база знаний</li></ul><h3>Минусы</h3><ul><li>Больший вес (около 1400 кг)</li><li>Дорогой ремонт при серьезных поломках</li><li>Часто требует замены подшипников ступиц и сайлентблоков</li></ul><h3>Бюджет</h3><ul><li>Покупка: 400-600 тысяч рублей</li><li>Подготовка: 200-300 тысяч рублей</li><li><strong>Итого: 600-900 тысяч рублей</strong></li></ul><hr><h2>Nissan Silvia S14 (1993-1998)</h2><h3>Плюсы</h3><ul><li>Меньший вес (около 1200 кг)</li><li>Двигатель SR20DET с большим тюнинг-потенциалом</li><li>\"Правильная\" дрифт-геометрия из коробки</li><li>Культовый статус в дрифт-культуре</li></ul><h3>Минусы</h3><ul><li>Дороже в покупке</li><li>Запчасти нужно заказывать</li><li>Правый руль (не всем удобно)</li><li>Возраст автомобилей (часто требуют восстановления)</li></ul><h3>Бюджет</h3><ul><li>Покупка: 800-1200 тысяч рублей</li><li>Подготовка: 200-300 тысяч рублей</li><li><strong>Итого: 1000-1500 тысяч рублей</strong></li></ul><hr><h2>Вердикт</h2><blockquote><p>Для новичка с ограниченным бюджетом лучше выбрать BMW E46. Если же бюджет позволяет и хочется \"настоящий\" дрифт-кар с историей - Nissan Silvia будет отличным выбором. Главное - не гнаться за мощностью на первых этапах!</p></blockquote>",
      htmlContent: "<p>Выбор первого дрифт-кара - важное решение, которое влияет на скорость обучения и бюджет. Рассмотрим два самых популярных варианта.</p><h2>BMW E46 (1998-2006)</h2><h3>Плюсы</h3><ul><li>Доступность запчастей</li><li>Надежный рядный 6-цилиндровый двигатель</li><li>Хорошая развесовка (50/50)</li><li>Большое комьюнити и база знаний</li></ul><h3>Минусы</h3><ul><li>Больший вес (около 1400 кг)</li><li>Дорогой ремонт при серьезных поломках</li><li>Часто требует замены подшипников ступиц и сайлентблоков</li></ul><h3>Бюджет</h3><ul><li>Покупка: 400-600 тысяч рублей</li><li>Подготовка: 200-300 тысяч рублей</li><li><strong>Итого: 600-900 тысяч рублей</strong></li></ul><hr><h2>Nissan Silvia S14 (1993-1998)</h2><h3>Плюсы</h3><ul><li>Меньший вес (около 1200 кг)</li><li>Двигатель SR20DET с большим тюнинг-потенциалом</li><li>\"Правильная\" дрифт-геометрия из коробки</li><li>Культовый статус в дрифт-культуре</li></ul><h3>Минусы</h3><ul><li>Дороже в покупке</li><li>Запчасти нужно заказывать</li><li>Правый руль (не всем удобно)</li><li>Возраст автомобилей (часто требуют восстановления)</li></ul><h3>Бюджет</h3><ul><li>Покупка: 800-1200 тысяч рублей</li><li>Подготовка: 200-300 тысяч рублей</li><li><strong>Итого: 1000-1500 тысяч рублей</strong></li></ul><hr><h2>Вердикт</h2><blockquote><p>Для новичка с ограниченным бюджетом лучше выбрать BMW E46. Если же бюджет позволяет и хочется \"настоящий\" дрифт-кар с историей - Nissan Silvia будет отличным выбором. Главное - не гнаться за мощностью на первых этапах!</p></blockquote>",
      published: true,
      publishedAt: new Date("2024-02-25"),
      views: 4231,
      categoryId: driftCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=600&fit=crop",
      tags: ["guides", "cars", "tuning"],
      minTier: 0,
      defaultLocale: "ru",
      translations: {
        en: {
          title: "Choosing Your First Drift Car: BMW vs Nissan",
          excerpt: "Comparing two popular options for beginner drifters: BMW E46 and Nissan Silvia S14",
          content: "<p>Choosing your first drift car is an important decision that affects your learning speed and budget. Let's look at two popular options.</p><h2>BMW E46 (1998-2006)</h2><h3>Pros</h3><ul><li>Parts availability</li><li>Reliable inline 6-cylinder engine</li><li>Good weight distribution (50/50)</li><li>Large community and knowledge base</li></ul><h3>Cons</h3><ul><li>Higher weight (about 1400 kg)</li><li>Expensive repairs for serious breakdowns</li><li>Often requires wheel bearing and bushing replacement</li></ul><h3>Budget</h3><ul><li>Purchase: $5,000-8,000</li><li>Preparation: $2,500-4,000</li><li><strong>Total: $7,500-12,000</strong></li></ul><hr><h2>Nissan Silvia S14 (1993-1998)</h2><h3>Pros</h3><ul><li>Lower weight (about 1200 kg)</li><li>SR20DET engine with great tuning potential</li><li>\"Proper\" drift geometry out of the box</li><li>Cult status in drift culture</li></ul><h3>Cons</h3><ul><li>More expensive to buy</li><li>Parts need to be ordered</li><li>Right-hand drive (not convenient for everyone)</li><li>Age of vehicles (often require restoration)</li></ul><h3>Budget</h3><ul><li>Purchase: $10,000-15,000</li><li>Preparation: $2,500-4,000</li><li><strong>Total: $12,500-19,000</strong></li></ul><hr><h2>Verdict</h2><blockquote><p>For a beginner with a limited budget, the BMW E46 is the better choice. If your budget allows and you want a \"real\" drift car with history - the Nissan Silvia will be an excellent choice. The main thing is not to chase power in the early stages!</p></blockquote>",
          htmlContent: "<p>Choosing your first drift car is an important decision that affects your learning speed and budget. Let's look at two popular options.</p><h2>BMW E46 (1998-2006)</h2><h3>Pros</h3><ul><li>Parts availability</li><li>Reliable inline 6-cylinder engine</li><li>Good weight distribution (50/50)</li><li>Large community and knowledge base</li></ul><h3>Cons</h3><ul><li>Higher weight (about 1400 kg)</li><li>Expensive repairs for serious breakdowns</li><li>Often requires wheel bearing and bushing replacement</li></ul><h3>Budget</h3><ul><li>Purchase: $5,000-8,000</li><li>Preparation: $2,500-4,000</li><li><strong>Total: $7,500-12,000</strong></li></ul><hr><h2>Nissan Silvia S14 (1993-1998)</h2><h3>Pros</h3><ul><li>Lower weight (about 1200 kg)</li><li>SR20DET engine with great tuning potential</li><li>\"Proper\" drift geometry out of the box</li><li>Cult status in drift culture</li></ul><h3>Cons</h3><ul><li>More expensive to buy</li><li>Parts need to be ordered</li><li>Right-hand drive (not convenient for everyone)</li><li>Age of vehicles (often require restoration)</li></ul><h3>Budget</h3><ul><li>Purchase: $10,000-15,000</li><li>Preparation: $2,500-4,000</li><li><strong>Total: $12,500-19,000</strong></li></ul><hr><h2>Verdict</h2><blockquote><p>For a beginner with a limited budget, the BMW E46 is the better choice. If your budget allows and you want a \"real\" drift car with history - the Nissan Silvia will be an excellent choice. The main thing is not to chase power in the early stages!</p></blockquote>",
        },
      },
    },
  ];

  const createdPosts = [];
  for (const post of blogPosts) {
    const { tags: postTags, ...postData } = post;
    const createdPost = await prisma.blogPost.upsert({
      where: { slug: postData.slug },
      update: {
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        htmlContent: postData.htmlContent,
        coverImage: postData.coverImage,
        minTier: postData.minTier,
        categoryId: postData.categoryId,
        translations: postData.translations,
      },
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

  // Create News items
  console.log("Creating news items...");
  
  const newsItems = [
    {
      title: "JEMSO Club: итоги встречи февраля 2024",
      slug: "jemso-club-february-2024-meetup",
      excerpt: "Более 50 участников, интересные автомобили и отличная атмосфера - отчет о февральской встрече клуба",
      content: "<p>18 февраля состоялась очередная встреча автомобильного клуба JEMSO. Несмотря на морозную погоду, более 50 энтузиастов собрались на парковке торгового центра \"Мега\", чтобы пообщаться, обменяться опытом и просто провести время среди единомышленников.</p><h2>Highlights встречи</h2><h3>Автомобили месяца</h3><p>На этот раз нас порадовали несколько интересных проектов:</p><ul><li><strong>Toyota Supra A80</strong> с двигателем 2JZ-GTE на 650 л.с. - владелец Дмитрий рассказал о процессе постройки и поделился опытом настройки турбины</li><li><strong>Nissan Silvia S15</strong> в дрифт-спеке - свежий импорт из Японии с оригинальным пробегом всего 89 000 км</li><li><strong>BMW E46 M3</strong> в Ring-конфигурации - владелец активно участвует в трек-днях и делится своим опытом</li></ul><figure><img src=\"https://images.unsplash.com/photo-1469285994282-454ceb49e63c?w=1200&h=600&fit=crop\" alt=\"Встреча клуба JEMSO\"><figcaption>Участники февральской встречи JEMSO Club</figcaption></figure><h3>Технические доклады</h3><p>Наш постоянный участник и механик Сергей провел мини-лекцию о подготовке автомобиля к сезону:</p><ul><li>Замена технических жидкостей</li><li>Проверка тормозной системы</li><li>Диагностика подвески</li><li>Подготовка к техосмотру</li></ul><h3>Планы на сезон 2024</h3><p>Обсудили календарь мероприятий клуба:</p><ul><li>Март - выезд на картинг</li><li>Апрель - открытие сезона трек-дней</li><li>Май - совместная поездка на Moscow Raceway</li><li>Июнь - летний караван в горы</li></ul><h2>Присоединяйтесь!</h2><p>Встречи клуба JEMSO проходят каждое третье воскресенье месяца. Следите за анонсами в нашем Telegram-канале. Участие бесплатное, приветствуются все марки и модели автомобилей!</p>",
      htmlContent: "<p>18 февраля состоялась очередная встреча автомобильного клуба JEMSO. Несмотря на морозную погоду, более 50 энтузиастов собрались на парковке торгового центра \"Мега\", чтобы пообщаться, обменяться опытом и просто провести время среди единомышленников.</p><h2>Highlights встречи</h2><h3>Автомобили месяца</h3><p>На этот раз нас порадовали несколько интересных проектов:</p><ul><li><strong>Toyota Supra A80</strong> с двигателем 2JZ-GTE на 650 л.с. - владелец Дмитрий рассказал о процессе постройки и поделился опытом настройки турбины</li><li><strong>Nissan Silvia S15</strong> в дрифт-спеке - свежий импорт из Японии с оригинальным пробегом всего 89 000 км</li><li><strong>BMW E46 M3</strong> в Ring-конфигурации - владелец активно участвует в трек-днях и делится своим опытом</li></ul><figure><img src=\"https://images.unsplash.com/photo-1469285994282-454ceb49e63c?w=1200&h=600&fit=crop\" alt=\"Встреча клуба JEMSO\"><figcaption>Участники февральской встречи JEMSO Club</figcaption></figure><h3>Технические доклады</h3><p>Наш постоянный участник и механик Сергей провел мини-лекцию о подготовке автомобиля к сезону:</p><ul><li>Замена технических жидкостей</li><li>Проверка тормозной системы</li><li>Диагностика подвески</li><li>Подготовка к техосмотру</li></ul><h3>Планы на сезон 2024</h3><p>Обсудили календарь мероприятий клуба:</p><ul><li>Март - выезд на картинг</li><li>Апрель - открытие сезона трек-дней</li><li>Май - совместная поездка на Moscow Raceway</li><li>Июнь - летний караван в горы</li></ul><h2>Присоединяйтесь!</h2><p>Встречи клуба JEMSO проходят каждое третье воскресенье месяца. Следите за анонсами в нашем Telegram-канале. Участие бесплатное, приветствуются все марки и модели автомобилей!</p>",
      published: true,
      publishedAt: new Date("2024-02-19"),
      views: 892,
      categoryId: clubCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1469285994282-454ceb49e63c?w=1200&h=600&fit=crop",
      tags: ["news", "club"],
      minTier: 0,
      defaultLocale: "ru",
      translations: {
        en: {
          title: "JEMSO Club: February 2024 Meetup Recap",
          excerpt: "Over 50 participants, interesting cars and great atmosphere - report from the February club meeting",
          content: "<p>On February 18, another meeting of the JEMSO car club took place. Despite the freezing weather, over 50 enthusiasts gathered in the Mega shopping center parking lot to chat, share experiences, and simply spend time among like-minded people.</p><h2>Meeting Highlights</h2><h3>Cars of the Month</h3><p>This time we were delighted by several interesting projects:</p><ul><li><strong>Toyota Supra A80</strong> with a 650 hp 2JZ-GTE engine - owner Dmitry talked about the build process and shared his turbo tuning experience</li><li><strong>Nissan Silvia S15</strong> in drift spec - fresh import from Japan with original mileage of only 89,000 km</li><li><strong>BMW E46 M3</strong> in Ring configuration - the owner actively participates in track days and shares his experience</li></ul><h3>Technical Talks</h3><p>Our regular participant and mechanic Sergey gave a mini-lecture on preparing the car for the season:</p><ul><li>Changing technical fluids</li><li>Checking the brake system</li><li>Suspension diagnostics</li><li>Preparing for inspection</li></ul><h3>Plans for 2024 Season</h3><p>We discussed the club's event calendar:</p><ul><li>March - karting trip</li><li>April - track day season opening</li><li>May - group trip to Moscow Raceway</li><li>June - summer caravan to the mountains</li></ul><h2>Join Us!</h2><p>JEMSO club meetings are held every third Sunday of the month. Follow announcements in our Telegram channel. Participation is free, all car makes and models are welcome!</p>",
          htmlContent: "<p>On February 18, another meeting of the JEMSO car club took place. Despite the freezing weather, over 50 enthusiasts gathered in the Mega shopping center parking lot to chat, share experiences, and simply spend time among like-minded people.</p><h2>Meeting Highlights</h2><h3>Cars of the Month</h3><p>This time we were delighted by several interesting projects:</p><ul><li><strong>Toyota Supra A80</strong> with a 650 hp 2JZ-GTE engine - owner Dmitry talked about the build process and shared his turbo tuning experience</li><li><strong>Nissan Silvia S15</strong> in drift spec - fresh import from Japan with original mileage of only 89,000 km</li><li><strong>BMW E46 M3</strong> in Ring configuration - the owner actively participates in track days and shares his experience</li></ul><h3>Technical Talks</h3><p>Our regular participant and mechanic Sergey gave a mini-lecture on preparing the car for the season:</p><ul><li>Changing technical fluids</li><li>Checking the brake system</li><li>Suspension diagnostics</li><li>Preparing for inspection</li></ul><h3>Plans for 2024 Season</h3><p>We discussed the club's event calendar:</p><ul><li>March - karting trip</li><li>April - track day season opening</li><li>May - group trip to Moscow Raceway</li><li>June - summer caravan to the mountains</li></ul><h2>Join Us!</h2><p>JEMSO club meetings are held every third Sunday of the month. Follow announcements in our Telegram channel. Participation is free, all car makes and models are welcome!</p>",
        },
      },
    },
    {
      title: "Новые правила участия в трек-днях 2024",
      slug: "track-day-rules-2024",
      excerpt: "Важные изменения в регламенте безопасности и допуска автомобилей к трек-дням в новом сезоне",
      content: "<p>Уважаемые участники! С 2024 года вводятся новые правила допуска автомобилей к трек-дням.</p><h2>Основные изменения</h2><ul><li>Обязательное наличие буксировочных крюков спереди и сзади</li><li>Запрет на использование шин с treadwear ниже 140 для класса Street</li><li>Обязательное наличие огнетушителя в салоне</li></ul><p>Просим ознакомиться с полным регламентом на сайте организатора.</p>",
      htmlContent: "<p>Уважаемые участники! С 2024 года вводятся новые правила допуска автомобилей к трек-дням.</p><h2>Основные изменения</h2><ul><li>Обязательное наличие буксировочных крюков спереди и сзади</li><li>Запрет на использование шин с treadwear ниже 140 для класса Street</li><li>Обязательное наличие огнетушителя в салоне</li></ul><p>Просим ознакомиться с полным регламентом на сайте организатора.</p>",
      published: true,
      publishedAt: new Date("2024-03-01"),
      views: 543,
      categoryId: ringCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=600&fit=crop",
      tags: ["news", "safety"],
      minTier: 0,
      defaultLocale: "ru",
      translations: {
        en: {
          title: "New Track Day Participation Rules 2024",
          excerpt: "Important changes in safety regulations and vehicle admission to track days in the new season",
          content: "<p>Dear participants! Starting from 2024, new rules for vehicle admission to track days are being introduced.</p><h2>Main Changes</h2><ul><li>Mandatory tow hooks front and rear</li><li>Prohibition on tires with treadwear below 140 for Street class</li><li>Mandatory fire extinguisher in the cabin</li></ul><p>Please review the complete regulations on the organizer's website.</p>",
          htmlContent: "<p>Dear participants! Starting from 2024, new rules for vehicle admission to track days are being introduced.</p><h2>Main Changes</h2><ul><li>Mandatory tow hooks front and rear</li><li>Prohibition on tires with treadwear below 140 for Street class</li><li>Mandatory fire extinguisher in the cabin</li></ul><p>Please review the complete regulations on the organizer's website.</p>",
        },
      },
    },
    {
      title: "Эксклюзив: Фотоотчет с закрытой презентации JEMSO X",
      slug: "jemso-x-presentation-photos",
      excerpt: "Только для подписчиков: эксклюзивные кадры с презентации нового проекта JEMSO X",
      content: "<p>Это закрытый материал, доступный только для подписчиков.</p><p>На прошлой неделе прошла секретная презентация нашего нового проекта. Мы готовы поделиться первыми кадрами с вами!</p><h2>Галерея</h2><p>[Фотографии доступны только для подписчиков]</p>",
      htmlContent: "<p>Это закрытый материал, доступный только для подписчиков.</p><p>На прошлой неделе прошла секретная презентация нашего нового проекта. Мы готовы поделиться первыми кадрами с вами!</p><h2>Галерея</h2><p>[Фотографии доступны только для подписчиков]</p>",
      published: true,
      publishedAt: new Date("2024-03-10"),
      views: 120,
      categoryId: clubCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1200&h=600&fit=crop",
      tags: ["news"],
      minTier: 1, // Basic plan required
      defaultLocale: "ru",
      translations: {
        en: {
          title: "Exclusive: Photo Report from Private JEMSO X Presentation",
          excerpt: "Subscribers only: exclusive shots from the new JEMSO X project presentation",
          content: "<p>This is exclusive content available only for subscribers.</p><p>Last week, a secret presentation of our new project took place. We're ready to share the first shots with you!</p><h2>Gallery</h2><p>[Photos available only for subscribers]</p>",
          htmlContent: "<p>This is exclusive content available only for subscribers.</p><p>Last week, a secret presentation of our new project took place. We're ready to share the first shots with you!</p><h2>Gallery</h2><p>[Photos available only for subscribers]</p>",
        },
      },
    },
  ];

  const createdNews = [];
  for (const news of newsItems) {
    const { tags: newsTags, ...newsData } = news;
    const createdNewsItem = await prisma.news.upsert({
      where: { slug: newsData.slug },
      update: {
        title: newsData.title,
        excerpt: newsData.excerpt,
        content: newsData.content,
        htmlContent: newsData.htmlContent,
        coverImage: newsData.coverImage,
        minTier: newsData.minTier,
        categoryId: newsData.categoryId,
        translations: newsData.translations,
      },
      create: newsData,
    });
    createdNews.push({ news: createdNewsItem, tags: newsTags });
  }
  console.log(`✅ Created ${newsItems.length} news items`);

  // Associate tags with news
  console.log("Associating tags with news...");
  for (const { news, tags: tagSlugs } of createdNews) {
    for (const tagSlug of tagSlugs) {
      const tag = createdTags.find(t => t.slug === tagSlug);
      if (tag) {
        await prisma.newsTag.upsert({
          where: {
            newsId_tagId: {
              newsId: news.id,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            newsId: news.id,
            tagId: tag.id,
          },
        });
      }
    }
  }
  console.log(`✅ Associated tags with news`);

  // Create events
  console.log("Creating events...");

  const events = [
    {
      title: "Открытие дрифт-сезона 2024",
      slug: "drift-season-opening-2024",
      excerpt: "Первое соревнование сезона на автодроме ADM Raceway",
      content: "<p>Приглашаем всех любителей дрифта на открытие сезона 2024!</p><h2>Программа мероприятия</h2><h3>10:00 - Регистрация участников</h3><p>Административные проверки, технический осмотр автомобилей</p><h3>11:00 - Квалификация</h3><p>Одиночные заезды для определения сетки пар</p><h3>14:00 - Парные заезды</h3><p>Основные соревнования в формате битв один на один</p><h3>17:00 - Финалы и награждение</h3><p>Определение победителей и торжественное награждение</p><h2>Требования к участникам</h2><ul><li>Спортивная лицензия или лицензия начинающего</li><li>Технически исправный автомобиль</li><li>Шлем (можно взять в аренду на месте)</li><li>Опыт дрифта приветствуется, но не обязателен</li></ul><blockquote><p>Зрители приветствуются! Вход свободный.</p></blockquote>",
      htmlContent: "<p>Приглашаем всех любителей дрифта на открытие сезона 2024!</p><h2>Программа мероприятия</h2><h3>10:00 - Регистрация участников</h3><p>Административные проверки, технический осмотр автомобилей</p><h3>11:00 - Квалификация</h3><p>Одиночные заезды для определения сетки пар</p><h3>14:00 - Парные заезды</h3><p>Основные соревнования в формате битв один на один</p><h3>17:00 - Финалы и награждение</h3><p>Определение победителей и торжественное награждение</p><h2>Требования к участникам</h2><ul><li>Спортивная лицензия или лицензия начинающего</li><li>Технически исправный автомобиль</li><li>Шлем (можно взять в аренду на месте)</li><li>Опыт дрифта приветствуется, но не обязателен</li></ul><blockquote><p>Зрители приветствуются! Вход свободный.</p></blockquote>",
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
      coverImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=600&fit=crop",
      minTier: 0,
      defaultLocale: "ru",
      translations: {
        en: {
          title: "Drift Season Opening 2024",
          excerpt: "First competition of the season at ADM Raceway",
          content: "<p>We invite all drift enthusiasts to the 2024 season opening!</p><h2>Event Schedule</h2><h3>10:00 - Registration</h3><p>Administrative checks, technical vehicle inspection</p><h3>11:00 - Qualifying</h3><p>Solo runs to determine tandem bracket</p><h3>14:00 - Tandem Battles</h3><p>Main competition in one-on-one battle format</p><h3>17:00 - Finals and Awards</h3><p>Determining winners and award ceremony</p><h2>Participant Requirements</h2><ul><li>Sports license or beginner's license</li><li>Technically sound vehicle</li><li>Helmet (rental available on site)</li><li>Drift experience welcome but not required</li></ul><blockquote><p>Spectators welcome! Free admission.</p></blockquote>",
          htmlContent: "<p>We invite all drift enthusiasts to the 2024 season opening!</p><h2>Event Schedule</h2><h3>10:00 - Registration</h3><p>Administrative checks, technical vehicle inspection</p><h3>11:00 - Qualifying</h3><p>Solo runs to determine tandem bracket</p><h3>14:00 - Tandem Battles</h3><p>Main competition in one-on-one battle format</p><h3>17:00 - Finals and Awards</h3><p>Determining winners and award ceremony</p><h2>Participant Requirements</h2><ul><li>Sports license or beginner's license</li><li>Technically sound vehicle</li><li>Helmet (rental available on site)</li><li>Drift experience welcome but not required</li></ul><blockquote><p>Spectators welcome! Free admission.</p></blockquote>",
        },
      },
    },
    {
      title: "Drag Racing Championship - 1 этап",
      slug: "drag-racing-championship-stage-1",
      excerpt: "Первый этап чемпионата России по дрэг-рейсингу",
      content: "<p>Russian Drag Racing Championship открывает сезон 2024!</p><h2>Классы участников</h2><h3>Street Class</h3><p>Дорожные автомобили с минимальными модификациями</p><ul><li>До 400 л.с.</li><li>Дорожная резина</li><li>Полный интерьер</li></ul><h3>Pro Street</h3><ul><li>До 800 л.с.</li><li>Слики разрешены</li><li>Каркас безопасности обязателен</li></ul><h3>Pro Modified</h3><ul><li>Без ограничений по мощности</li><li>Специализированные дрэг-кары</li><li>Профессиональные пилоты</li></ul><h2>Расписание</h2><h3>Пятница, 10 мая</h3><ul><li>14:00-20:00 - Свободные заезды и тренировки</li></ul><h3>Суббота, 11 мая</h3><ul><li>10:00-12:00 - Квалификация Street Class</li><li>13:00-15:00 - Квалификация Pro Street</li><li>16:00-18:00 - Квалификация Pro Modified</li></ul><h3>Воскресенье, 12 мая</h3><ul><li>10:00 - Начало элиминаций</li><li>16:00 - Финалы</li><li>17:00 - Награждение</li></ul><blockquote><p>Регистрация открыта до 1 мая на сайте RDRC.</p></blockquote>",
      htmlContent: "<p>Russian Drag Racing Championship открывает сезон 2024!</p><h2>Классы участников</h2><h3>Street Class</h3><p>Дорожные автомобили с минимальными модификациями</p><ul><li>До 400 л.с.</li><li>Дорожная резина</li><li>Полный интерьер</li></ul><h3>Pro Street</h3><ul><li>До 800 л.с.</li><li>Слики разрешены</li><li>Каркас безопасности обязателен</li></ul><h3>Pro Modified</h3><ul><li>Без ограничений по мощности</li><li>Специализированные дрэг-кары</li><li>Профессиональные пилоты</li></ul><h2>Расписание</h2><h3>Пятница, 10 мая</h3><ul><li>14:00-20:00 - Свободные заезды и тренировки</li></ul><h3>Суббота, 11 мая</h3><ul><li>10:00-12:00 - Квалификация Street Class</li><li>13:00-15:00 - Квалификация Pro Street</li><li>16:00-18:00 - Квалификация Pro Modified</li></ul><h3>Воскресенье, 12 мая</h3><ul><li>10:00 - Начало элиминаций</li><li>16:00 - Финалы</li><li>17:00 - Награждение</li></ul><blockquote><p>Регистрация открыта до 1 мая на сайте RDRC.</p></blockquote>",
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
      coverImage: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&h=600&fit=crop",
      minTier: 0,
      defaultLocale: "ru",
      translations: {
        en: {
          title: "Drag Racing Championship - Stage 1",
          excerpt: "First stage of the Russian Drag Racing Championship",
          content: "<p>Russian Drag Racing Championship opens the 2024 season!</p><h2>Participant Classes</h2><h3>Street Class</h3><p>Street cars with minimal modifications</p><ul><li>Up to 400 hp</li><li>Street tires</li><li>Full interior</li></ul><h3>Pro Street</h3><ul><li>Up to 800 hp</li><li>Slicks allowed</li><li>Roll cage mandatory</li></ul><h3>Pro Modified</h3><ul><li>No power limit</li><li>Specialized drag cars</li><li>Professional drivers</li></ul><h2>Schedule</h2><h3>Friday, May 10</h3><ul><li>14:00-20:00 - Test & tune, practice</li></ul><h3>Saturday, May 11</h3><ul><li>10:00-12:00 - Street Class qualifying</li><li>13:00-15:00 - Pro Street qualifying</li><li>16:00-18:00 - Pro Modified qualifying</li></ul><h3>Sunday, May 12</h3><ul><li>10:00 - Eliminations start</li><li>16:00 - Finals</li><li>17:00 - Awards ceremony</li></ul><blockquote><p>Registration open until May 1 on the RDRC website.</p></blockquote>",
          htmlContent: "<p>Russian Drag Racing Championship opens the 2024 season!</p><h2>Participant Classes</h2><h3>Street Class</h3><p>Street cars with minimal modifications</p><ul><li>Up to 400 hp</li><li>Street tires</li><li>Full interior</li></ul><h3>Pro Street</h3><ul><li>Up to 800 hp</li><li>Slicks allowed</li><li>Roll cage mandatory</li></ul><h3>Pro Modified</h3><ul><li>No power limit</li><li>Specialized drag cars</li><li>Professional drivers</li></ul><h2>Schedule</h2><h3>Friday, May 10</h3><ul><li>14:00-20:00 - Test & tune, practice</li></ul><h3>Saturday, May 11</h3><ul><li>10:00-12:00 - Street Class qualifying</li><li>13:00-15:00 - Pro Street qualifying</li><li>16:00-18:00 - Pro Modified qualifying</li></ul><h3>Sunday, May 12</h3><ul><li>10:00 - Eliminations start</li><li>16:00 - Finals</li><li>17:00 - Awards ceremony</li></ul><blockquote><p>Registration open until May 1 on the RDRC website.</p></blockquote>",
        },
      },
    },
    {
      title: "Track Day для начинающих",
      slug: "beginners-track-day-may-2024",
      excerpt: "Специальный трек-день для новичков с инструкторами",
      content: "<p>Первый раз на треке? Этот трек-день специально для вас!</p><h2>Что включено</h2><h3>Теоретическая часть (1 час)</h3><ul><li>Правила безопасности на треке</li><li>Правильная траектория</li><li>Техника прохождения поворотов</li><li>Работа с тормозами</li></ul><h3>Практические занятия (4 часа)</h3><ul><li>Персональный инструктор в вашем автомобиле</li><li>4 сессии по 20 минут</li><li>Разбор ошибок после каждой сессии</li><li>Видеоанализ прохождения круга</li></ul><h3>Дополнительно</h3><ul><li>Кофе-брейк</li><li>Обед</li><li>Видеозапись ваших заездов</li><li>Сертификат участника</li></ul><h2>Требования</h2><ul><li>Технически исправный автомобиль</li><li>Водительский стаж от 1 года</li><li>Желание учиться!</li></ul><blockquote><p>Количество мест ограничено - 20 участников.</p></blockquote>",
      htmlContent: "<p>Первый раз на треке? Этот трек-день специально для вас!</p><h2>Что включено</h2><h3>Теоретическая часть (1 час)</h3><ul><li>Правила безопасности на треке</li><li>Правильная траектория</li><li>Техника прохождения поворотов</li><li>Работа с тормозами</li></ul><h3>Практические занятия (4 часа)</h3><ul><li>Персональный инструктор в вашем автомобиле</li><li>4 сессии по 20 минут</li><li>Разбор ошибок после каждой сессии</li><li>Видеоанализ прохождения круга</li></ul><h3>Дополнительно</h3><ul><li>Кофе-брейк</li><li>Обед</li><li>Видеозапись ваших заездов</li><li>Сертификат участника</li></ul><h2>Требования</h2><ul><li>Технически исправный автомобиль</li><li>Водительский стаж от 1 года</li><li>Желание учиться!</li></ul><blockquote><p>Количество мест ограничено - 20 участников.</p></blockquote>",
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
      coverImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=600&fit=crop",
      minTier: 1, // Basic plan required
      defaultLocale: "ru",
      translations: {
        en: {
          title: "Track Day for Beginners",
          excerpt: "Special track day for beginners with instructors",
          content: "<p>First time on track? This track day is made for you!</p><h2>What's Included</h2><h3>Theory Session (1 hour)</h3><ul><li>Track safety rules</li><li>Proper racing line</li><li>Cornering technique</li><li>Braking technique</li></ul><h3>Practical Sessions (4 hours)</h3><ul><li>Personal instructor in your car</li><li>4 sessions of 20 minutes</li><li>Feedback after each session</li><li>Video analysis of your laps</li></ul><h3>Additionally</h3><ul><li>Coffee break</li><li>Lunch</li><li>Video recording of your sessions</li><li>Participation certificate</li></ul><h2>Requirements</h2><ul><li>Technically sound vehicle</li><li>At least 1 year of driving experience</li><li>Willingness to learn!</li></ul><blockquote><p>Limited to 20 participants.</p></blockquote>",
          htmlContent: "<p>First time on track? This track day is made for you!</p><h2>What's Included</h2><h3>Theory Session (1 hour)</h3><ul><li>Track safety rules</li><li>Proper racing line</li><li>Cornering technique</li><li>Braking technique</li></ul><h3>Practical Sessions (4 hours)</h3><ul><li>Personal instructor in your car</li><li>4 sessions of 20 minutes</li><li>Feedback after each session</li><li>Video analysis of your laps</li></ul><h3>Additionally</h3><ul><li>Coffee break</li><li>Lunch</li><li>Video recording of your sessions</li><li>Participation certificate</li></ul><h2>Requirements</h2><ul><li>Technically sound vehicle</li><li>At least 1 year of driving experience</li><li>Willingness to learn!</li></ul><blockquote><p>Limited to 20 participants.</p></blockquote>",
        },
      },
    },
    {
      title: "JEMSO Summer Meet 2024",
      slug: "jemso-summer-meet-2024",
      excerpt: "Летняя встреча клуба с шоу-программой, BBQ и розыгрышем призов",
      content: "<p>Самое масштабное мероприятие клуба в году!</p><h2>Программа</h2><h3>12:00 - Открытие</h3><p>Регистрация участников, размещение автомобилей</p><h3>13:00 - Конкурс автомобилей</h3><ul><li>Лучший дрифт-кар</li><li>Лучший драг-кар</li><li>Лучший шоу-кар</li><li>Народный выбор</li></ul><h3>15:00 - BBQ и общение</h3><p>Отличная еда и напитки в неформальной обстановке</p><h3>17:00 - Демонстрационные заезды</h3><p>Показательные выступления профессиональных пилотов</p><h3>19:00 - Розыгрыш призов</h3><p>Ценные призы от спонсоров:</p><ul><li>Комплект спортивных тормозных колодок</li><li>Сертификаты на услуги сервисов</li><li>Мерч JEMSO</li></ul><h3>20:00 - After-party</h3><p>Продолжение в неформальной обстановке</p><hr><h2>Участие</h2><ul><li><strong>Для членов клуба:</strong> бесплатно</li><li><strong>Гости:</strong> 1000 рублей</li><li><strong>Участие автомобиля в конкурсе:</strong> бесплатно</li></ul><blockquote><p>Приглашаются все энтузиасты, независимо от марки и модели автомобиля!</p></blockquote>",
      htmlContent: "<p>Самое масштабное мероприятие клуба в году!</p><h2>Программа</h2><h3>12:00 - Открытие</h3><p>Регистрация участников, размещение автомобилей</p><h3>13:00 - Конкурс автомобилей</h3><ul><li>Лучший дрифт-кар</li><li>Лучший драг-кар</li><li>Лучший шоу-кар</li><li>Народный выбор</li></ul><h3>15:00 - BBQ и общение</h3><p>Отличная еда и напитки в неформальной обстановке</p><h3>17:00 - Демонстрационные заезды</h3><p>Показательные выступления профессиональных пилотов</p><h3>19:00 - Розыгрыш призов</h3><p>Ценные призы от спонсоров:</p><ul><li>Комплект спортивных тормозных колодок</li><li>Сертификаты на услуги сервисов</li><li>Мерч JEMSO</li></ul><h3>20:00 - After-party</h3><p>Продолжение в неформальной обстановке</p><hr><h2>Участие</h2><ul><li><strong>Для членов клуба:</strong> бесплатно</li><li><strong>Гости:</strong> 1000 рублей</li><li><strong>Участие автомобиля в конкурсе:</strong> бесплатно</li></ul><blockquote><p>Приглашаются все энтузиасты, независимо от марки и модели автомобиля!</p></blockquote>",
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
      coverImage: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=600&fit=crop",
      minTier: 0,
      defaultLocale: "ru",
      translations: {
        en: {
          title: "JEMSO Summer Meet 2024",
          excerpt: "Club summer meeting with show program, BBQ and prize giveaway",
          content: "<p>The biggest club event of the year!</p><h2>Schedule</h2><h3>12:00 - Opening</h3><p>Participant registration, car placement</p><h3>13:00 - Car Contest</h3><ul><li>Best drift car</li><li>Best drag car</li><li>Best show car</li><li>People's choice</li></ul><h3>15:00 - BBQ and Networking</h3><p>Great food and drinks in a casual atmosphere</p><h3>17:00 - Demo Runs</h3><p>Professional driver performances</p><h3>19:00 - Prize Draw</h3><p>Valuable prizes from sponsors:</p><ul><li>Set of sport brake pads</li><li>Service certificates</li><li>JEMSO merch</li></ul><h3>20:00 - After-party</h3><p>Continuation in a casual atmosphere</p><hr><h2>Participation</h2><ul><li><strong>Club members:</strong> free</li><li><strong>Guests:</strong> ~$10</li><li><strong>Car contest entry:</strong> free</li></ul><blockquote><p>All enthusiasts welcome, regardless of car make or model!</p></blockquote>",
          htmlContent: "<p>The biggest club event of the year!</p><h2>Schedule</h2><h3>12:00 - Opening</h3><p>Participant registration, car placement</p><h3>13:00 - Car Contest</h3><ul><li>Best drift car</li><li>Best drag car</li><li>Best show car</li><li>People's choice</li></ul><h3>15:00 - BBQ and Networking</h3><p>Great food and drinks in a casual atmosphere</p><h3>17:00 - Demo Runs</h3><p>Professional driver performances</p><h3>19:00 - Prize Draw</h3><p>Valuable prizes from sponsors:</p><ul><li>Set of sport brake pads</li><li>Service certificates</li><li>JEMSO merch</li></ul><h3>20:00 - After-party</h3><p>Continuation in a casual atmosphere</p><hr><h2>Participation</h2><ul><li><strong>Club members:</strong> free</li><li><strong>Guests:</strong> ~$10</li><li><strong>Car contest entry:</strong> free</li></ul><blockquote><p>All enthusiasts welcome, regardless of car make or model!</p></blockquote>",
        },
      },
    },
    {
      title: "JEMSO Winter Drift Festival 2026",
      slug: "winter-drift-festival-2026",
      excerpt: "Большой зимний фестиваль дрифта для всех желающих",
      content: "<p>Зимний дрифт - это отдельная культура! Приглашаем всех на наш ежегодный фестиваль.</p><h2>Программа</h2><ul><li>Мацури на льду</li><li>Соревнования в классе \"Жигули\"</li><li>Дрифт-такси</li><li>Горячий чай и полевая кухня</li></ul>",
      htmlContent: "<p>Зимний дрифт - это отдельная культура! Приглашаем всех на наш ежегодный фестиваль.</p><h2>Программа</h2><ul><li>Мацури на льду</li><li>Соревнования в классе \"Жигули\"</li><li>Дрифт-такси</li><li>Горячий чай и полевая кухня</li></ul>",
      published: true,
      publishedAt: new Date("2025-11-28"),
      views: 150,
      startDate: new Date("2026-01-15T10:00:00"),
      endDate: new Date("2026-01-16T18:00:00"),
      location: "ADM Raceway (Winter Config)",
      locationUrl: "https://maps.google.com/?q=ADM+Raceway",
      maxParticipants: 100,
      price: 2500,
      currency: "RUB",
      categoryId: driftCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=1200&h=600&fit=crop",
      minTier: 0,
      defaultLocale: "ru",
      translations: {
        en: {
          title: "JEMSO Winter Drift Festival 2026",
          excerpt: "Large winter drift festival open to everyone",
          content: "<p>Winter drifting is a culture of its own! We invite everyone to our annual festival.</p><h2>Schedule</h2><ul><li>Ice Matsuri</li><li>\"Lada\" class competition</li><li>Drift taxi</li><li>Hot tea and field kitchen</li></ul>",
          htmlContent: "<p>Winter drifting is a culture of its own! We invite everyone to our annual festival.</p><h2>Schedule</h2><ul><li>Ice Matsuri</li><li>\"Lada\" class competition</li><li>Drift taxi</li><li>Hot tea and field kitchen</li></ul>",
        },
      },
    },
    {
      title: "Ice Drift Training Camp",
      slug: "ice-drift-training-2026",
      excerpt: "Обучающий курс по зимнему дрифту для подписчиков Basic и выше",
      content: "<p>Научитесь контролировать автомобиль на льду под руководством опытных инструкторов.</p><h2>Что будем делать</h2><ul><li>Теория управления на скользком покрытии</li><li>Практика: \"восьмерка\", \"змейка\", перекладки</li><li>Работа газом и рулем</li></ul>",
      htmlContent: "<p>Научитесь контролировать автомобиль на льду под руководством опытных инструкторов.</p><h2>Что будем делать</h2><ul><li>Теория управления на скользком покрытии</li><li>Практика: \"восьмерка\", \"змейка\", перекладки</li><li>Работа газом и рулем</li></ul>",
      published: true,
      publishedAt: new Date("2025-11-28"),
      views: 85,
      startDate: new Date("2026-02-08T09:00:00"),
      endDate: new Date("2026-02-08T16:00:00"),
      location: "Мячково, Зимний полигон",
      locationUrl: "https://maps.google.com/?q=Myachkovo",
      maxParticipants: 15,
      price: 8000,
      currency: "RUB",
      categoryId: driftCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=1200&h=600&fit=crop",
      minTier: 1, // Basic
      defaultLocale: "ru",
      translations: {
        en: {
          title: "Ice Drift Training Camp",
          excerpt: "Winter drift training course for Basic subscribers and above",
          content: "<p>Learn to control a car on ice under the guidance of experienced instructors.</p><h2>What We'll Do</h2><ul><li>Theory of driving on slippery surfaces</li><li>Practice: \"figure eight\", \"slalom\", transitions</li><li>Throttle and steering work</li></ul>",
          htmlContent: "<p>Learn to control a car on ice under the guidance of experienced instructors.</p><h2>What We'll Do</h2><ul><li>Theory of driving on slippery surfaces</li><li>Practice: \"figure eight\", \"slalom\", transitions</li><li>Throttle and steering work</li></ul>",
        },
      },
    },
    {
      title: "Advanced Ring Taxi & Coaching",
      slug: "advanced-ring-coaching-2025-winter",
      excerpt: "Индивидуальные тренировки на треке с телеметрией для уровня Advanced",
      content: "<p>Продвинутый курс вождения на кольце.</p><h2>В программе</h2><ul><li>Анализ телеметрии</li><li>Настройка подвески под трек</li><li>Поиск идеальной траектории</li><li>Работа с RaceLogic</li></ul>",
      htmlContent: "<p>Продвинутый курс вождения на кольце.</p><h2>В программе</h2><ul><li>Анализ телеметрии</li><li>Настройка подвески под трек</li><li>Поиск идеальной траектории</li><li>Работа с RaceLogic</li></ul>",
      published: true,
      publishedAt: new Date("2025-11-28"),
      views: 230,
      startDate: new Date("2025-12-15T10:00:00"),
      endDate: new Date("2025-12-15T18:00:00"),
      location: "Moscow Raceway",
      locationUrl: "https://maps.google.com/?q=Moscow+Raceway",
      maxParticipants: 10,
      price: 25000,
      currency: "RUB",
      categoryId: ringCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=1200&h=600&fit=crop",
      minTier: 2, // Advanced
      defaultLocale: "ru",
      translations: {
        en: {
          title: "Advanced Ring Taxi & Coaching",
          excerpt: "Individual track training with telemetry for Advanced level",
          content: "<p>Advanced circuit driving course.</p><h2>Program</h2><ul><li>Telemetry analysis</li><li>Suspension setup for the track</li><li>Finding the ideal racing line</li><li>Working with RaceLogic</li></ul>",
          htmlContent: "<p>Advanced circuit driving course.</p><h2>Program</h2><ul><li>Telemetry analysis</li><li>Suspension setup for the track</li><li>Finding the ideal racing line</li><li>Working with RaceLogic</li></ul>",
        },
      },
    },
    {
      title: "Private Hypercar Test Day",
      slug: "vip-hypercar-test-2026",
      excerpt: "Закрытый тест-драйв спорткаров для VIP участников клуба",
      content: "<p>Уникальная возможность протестировать лучшие автомобили мира.</p><h2>Автопарк</h2><ul><li>Porsche 911 GT3 RS</li><li>Ferrari F8 Tributo</li><li>Lamborghini Huracan STO</li></ul><p>Включен фуршет и профессиональная фотосъемка.</p>",
      htmlContent: "<p>Уникальная возможность протестировать лучшие автомобили мира.</p><h2>Автопарк</h2><ul><li>Porsche 911 GT3 RS</li><li>Ferrari F8 Tributo</li><li>Lamborghini Huracan STO</li></ul><p>Включен фуршет и профессиональная фотосъемка.</p>",
      published: true,
      publishedAt: new Date("2025-11-28"),
      views: 450,
      startDate: new Date("2026-05-05T11:00:00"),
      endDate: new Date("2026-05-05T20:00:00"),
      location: "Sochi Autodrom",
      locationUrl: "https://maps.google.com/?q=Sochi+Autodrom",
      maxParticipants: 5,
      price: 0, // Free for VIP
      currency: "RUB",
      categoryId: clubCategory?.id,
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=600&fit=crop",
      minTier: 3, // VIP
      defaultLocale: "ru",
      translations: {
        en: {
          title: "Private Hypercar Test Day",
          excerpt: "Private test drive of supercars for VIP club members",
          content: "<p>A unique opportunity to test the world's best cars.</p><h2>Fleet</h2><ul><li>Porsche 911 GT3 RS</li><li>Ferrari F8 Tributo</li><li>Lamborghini Huracan STO</li></ul><p>Includes reception and professional photography.</p>",
          htmlContent: "<p>A unique opportunity to test the world's best cars.</p><h2>Fleet</h2><ul><li>Porsche 911 GT3 RS</li><li>Ferrari F8 Tributo</li><li>Lamborghini Huracan STO</li></ul><p>Includes reception and professional photography.</p>",
        },
      },
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {
        title: event.title,
        excerpt: event.excerpt,
        content: event.content,
        htmlContent: event.htmlContent,
        coverImage: event.coverImage,
        minTier: event.minTier,
        categoryId: event.categoryId,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        locationUrl: event.locationUrl,
        maxParticipants: event.maxParticipants,
        price: event.price,
        currency: event.currency,
        translations: event.translations,
      },
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
