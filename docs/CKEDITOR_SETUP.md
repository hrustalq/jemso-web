# CKEditor 5 Setup Guide

## License Key Configuration

CKEditor 5 requires a license key for use. The license key is configured via environment variables.

### For Open-Source Projects (GPL License)

If your project is open-source and uses the GPL license, you can get a **free GPL license key**:

1. Visit [CKEditor Pricing](https://ckeditor.com/pricing/)
2. Select "Open Source (GPL)" option
3. Fill out the form to receive your free GPL license key
4. Add the license key to your `.env` file:

```bash
NEXT_PUBLIC_CKEDITOR_LICENSE_KEY=your-gpl-license-key-here
```

### For Commercial Projects

For commercial projects, you need to purchase a license:

1. Visit [CKEditor Pricing](https://ckeditor.com/pricing/)
2. Choose the appropriate license tier for your needs
3. Purchase the license
4. Add the license key to your `.env` file:

```bash
NEXT_PUBLIC_CKEDITOR_LICENSE_KEY=your-commercial-license-key-here
```

### For Development/Testing

For local development, you can temporarily use an empty string (the editor will show warnings but should still function):

```bash
NEXT_PUBLIC_CKEDITOR_LICENSE_KEY=
```

**Note:** This is only for development. Production deployments require a valid license key.

## Environment Variable Setup

1. Add the license key to your `.env` file (or `.env.local` for local development):

```bash
NEXT_PUBLIC_CKEDITOR_LICENSE_KEY=your-license-key-here
```

2. Restart your development server after adding the environment variable:

```bash
pnpm dev
```

## Finding Your License Key

If you already have a CKEditor account:

1. Log in to the [CKEditor Customer Portal](https://support.ckeditor.com/hc/en-us/articles/4402351997330-Where-can-I-find-my-license-keys-or-token-endpoints)
2. Navigate to the "License keys" section
3. Copy your license key

## Troubleshooting

### Error: `license-key-missing`

This error occurs when:
- The license key is not set in your environment variables
- The license key is invalid or expired
- The environment variable is not accessible on the client side

**Solution:**
1. Ensure `NEXT_PUBLIC_CKEDITOR_LICENSE_KEY` is set in your `.env` file
2. Restart your development server
3. Verify the key is correct in the CKEditor Customer Portal
4. For open-source projects, ensure you're using a valid GPL license key

### Editor Not Loading

If the editor doesn't load:
1. Check browser console for errors
2. Verify the license key is correctly set
3. Ensure you've restarted the development server after adding the environment variable
4. Check that `NEXT_PUBLIC_` prefix is used (required for client-side access in Next.js)

## Additional Resources

- [CKEditor 5 Documentation](https://ckeditor.com/docs/ckeditor5/latest/)
- [CKEditor Licensing Guide](https://ckeditor.com/docs/ckeditor5/latest/support/licensing/)
- [CKEditor Pricing](https://ckeditor.com/pricing/)

