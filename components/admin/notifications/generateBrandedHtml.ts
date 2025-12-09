export type TemplatePreset = 'promotion' | 'announcement' | 'order'

export interface TemplateConfig {
  preheader: string
  ctaText: string
  ctaUrl: string
  footerNote: string
}

export interface GenerateOptions {
  themeColor?: string
  logoUrl?: string
  preset?: TemplatePreset
  appUrl?: string
}

// Pure utility (no React, no hooks)
export function generateBrandedHtml(
  subject: string,
  contentHtml: string,
  cfg: TemplateConfig,
  options: GenerateOptions = {}
): string {
  const appUrl = (options.appUrl || (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')) as string
  const color = (options.themeColor || '#f97316').trim()
  const logo = options.logoUrl || '/logoGro.png'
  const preset = options.preset || 'promotion'
  const presetBadge = preset === 'promotion' ? 'Deal' : preset === 'order' ? 'Order' : 'Notice'

  return `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>${subject}</title>
    <style>
      body{margin:0;padding:0;background:#f5f5f7;color:#111;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;}
      .preheader{display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;}
      a{color:${color};}
      @media only screen and (max-width:600px){
        .container{width:100%!important}
        .content{padding:16px!important}
      }
    </style>
  </head>
  <body>
    <span class="preheader">${cfg.preheader}</span>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width:640px;background:#ffffff">
      <tr>
        <td style="padding:0">
          <table role="presentation" width="100%" style="background:${color};color:#fff" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="padding:20px 16px">
                <img src="${logo}" alt="Gro-Delivery" width="40" height="40" style="display:block;border:0;border-radius:8px" />
                <div style="font-size:22px;font-weight:700;margin-top:8px">Gro-Delivery</div>
                <div style="font-size:12px;opacity:0.9;margin-top:6px;padding:2px 8px;border:1px solid rgba(255,255,255,0.5);border-radius:999px;display:inline-block">${presetBadge}</div>
                <h1 style="margin:12px 0 0;font-size:20px;line-height:1.3">${subject}</h1>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="content" style="padding:24px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafafa;border:1px solid #eee;border-radius:8px">
            <tr>
              <td style="padding:20px;font-size:15px;line-height:1.6;color:#111">
                ${contentHtml}
                ${cfg.ctaText && cfg.ctaUrl ? `
                <div style="text-align:center;margin-top:20px">
                  <a href="${cfg.ctaUrl}" target="_blank" rel="noopener" style="display:inline-block;background:${color};color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">${cfg.ctaText}</a>
                </div>` : ''}
              </td>
            </tr>
          </table>
          <div style="height:1px;background:#eee;margin:24px 0"></div>
          <p style="margin:0 0 6px;font-size:13px;color:#444">Need help? Visit our <a href="${appUrl}/help">Help Center</a> or reply to this email.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;background:#fafafa;text-align:center;color:#666;font-size:12px">
          <p style="margin:0 0 6px">${cfg.footerNote}</p>
          <p style="margin:0"> Gro-Delivery • <a href="${appUrl}">${appUrl.replace('https://','').replace('http://','')}</a></p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}