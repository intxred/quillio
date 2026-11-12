# Hosting the Quillio website

This folder is a plain static website (HTML, CSS, JavaScript). It needs no server, no build step and no database. Any static host works. All links are relative, so it also works from a sub-folder such as `https://intxred.github.io/quillio/`.

## Which host? (checked November 2026, limits change, so confirm on each site)

| | **Cloudflare Pages** (best fit) | **GitHub Pages** | **Vercel (Hobby)** | **Netlify** |
|---|---|---|---|---|
| Cost | Free | Free | Free | Free tier |
| Bandwidth | Unlimited for static files | Soft limit 100 GB a month | 100 GB a month included | Not checked |
| Your own security headers | **Yes** (`_headers` file) | No | Yes (`vercel.json`) | Yes (`_headers` file) |
| Rate limiting / firewall rules | **Yes**, in the dashboard (free plan: 1 rate-limit rule, confirm in your dashboard) | No | Yes, up to 3 custom rules | Not checked |
| DDoS protection | Included | Not checked | On by default | Not checked |
| Commercial use on the free plan | No restriction found | Not for online stores or commercial SaaS (a free app page is fine) | **Not allowed** (non-commercial only) | Not checked |
| Free web address | `name.pages.dev` | `intxred.github.io/quillio` | `name.vercel.app` | `name.netlify.app` |

**Recommendation:** Cloudflare Pages, because it has unlimited bandwidth, security headers and rate limiting at no cost. GitHub Pages is the simplest if you do not need those. Skip Vercel Hobby if you might ever charge for the app.

## What is in the folder

| Path | What it is |
|---|---|
| `index.html` | The whole page |
| `assets/config.js` | The only file you normally edit: contact email, LinkedIn link, download file names, sizes and checksums |
| `assets/style.css`, `assets/app.js`, `assets/mascot.js` | Design, behaviour, the hedgehog |
| `media/demo.mp4`, `media/poster.jpg`, `media/og-image.jpg` | Demo video, its thumbnail, link-preview image |
| `downloads/` | The Mac installer, the Windows installer and the source zip |
| `404.html`, `.nojekyll`, `robots.txt` | Not-found page and host settings |
| `_headers`, `vercel.json` | Security headers for Cloudflare Pages / Netlify, and for Vercel |

## Option 1: GitHub Pages (free, simplest)

Free for public repositories. Your GitHub user is `intxred`, so the site will be at `https://intxred.github.io/quillio/`.

1. **In your browser, on github.com signed in as intxred:** click **New repository**. Name it `quillio`. Choose **Public**. Leave "Add a README" unticked. Click **Create repository**.
2. **On your MacBook, in Terminal:** unzip the site to Downloads, then run:
   ```bash
   cd ~/Downloads/quillio-site
   git init -b main
   git add .
   git commit -m "Quillio website"
   git remote add origin https://github.com/intxred/quillio.git
   git push -u origin main
   ```
   If Git asks you to sign in, use your GitHub username and a **personal access token** as the password (GitHub, Settings, Developer settings, Personal access tokens), or run `gh auth login` first if you use the GitHub CLI.
3. **In your browser, on the repository page:** Settings, **Pages**. Under "Build and deployment" set Source to **Deploy from a branch**, Branch **main**, folder **/ (root)**, then **Save**.
4. Wait one or two minutes and refresh. The Pages screen shows your live address.

**To update later**, on your MacBook in Terminal, from the site folder: `git add . && git commit -m "Update" && git push`. The site redeploys by itself.

Limits to know: 1 GB site size, 100 GB bandwidth a month, and each file under 100 MB. The current download files total about 3 MB. If you later ship a bundled offline installer above 100 MB, attach it to a **GitHub Release** instead and point `assets/config.js` at the release URL.

## Option 2: Cloudflare Pages (free, recommended)

1. In your browser, sign in at dash.cloudflare.com. Open **Workers & Pages**, **Create**, **Pages**, **Upload assets**.
2. Name the project, drag in the unzipped `quillio-site` folder, click **Deploy**.
3. Your site is live at `https://<project-name>.pages.dev`. Upload the folder again to update it. Each file must be under 25 MB. The `_headers` file in the folder is picked up automatically.

## Option 3: Netlify Drop (free, quickest)

In your browser open app.netlify.com/drop and drag the unzipped folder onto the page. You get a live link in seconds. Create a free account to keep it.

## Your own domain (optional)

Prices vary and renewals are often higher than the first year, so check the renewal price before you buy. At Porkbun in November 2026 a `.xyz` name was about US$2 for the first year and about US$14 a year after that. A `.com` is usually around US$10 to 12 a year (check today's price). Cloudflare Registrar sells names at wholesale cost, with no markup. A free `pages.dev` or `github.io` address already has HTTPS, so a domain is only for looks and trust.

1. Buy a name from a registrar (Cloudflare Registrar, Porkbun, Namecheap).
2. **Cloudflare Pages:** open your project, **Custom domains**, **Set up a custom domain**, type the name and follow the steps. If the domain is also bought at Cloudflare, it connects itself.
3. **GitHub Pages:** repository Settings, Pages, **Custom domain**, type the domain, Save, tick **Enforce HTTPS**. At your registrar's DNS page add a `CNAME` record from `www` to `intxred.github.io`. For the bare domain add four `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
4. DNS changes can take up to a few hours.

## Security and rate limiting

A static site has no server, database or login to attack, so the risks are small: someone copying the page, someone flooding it with requests, and spam through the contact form.

1. **Security headers.** The `_headers` file turns on HTTPS-only, blocks the page being embedded in another site, stops browsers guessing file types, and allows scripts only from your own site. It was tested in a browser with this site. It works on Cloudflare Pages and Netlify. For Vercel use the included `vercel.json`. GitHub Pages cannot set headers.
2. **Rate limiting (Cloudflare).** In dash.cloudflare.com, pick your domain, then **Security**, **WAF**, **Rate limiting rules**, **Create rule**. A good first rule: URI path contains `/downloads/`, 20 requests per 1 minute per IP address, action **Managed Challenge**, for 10 minutes. This stops one visitor from downloading the installers over and over. Do not rate-limit the whole site, because it can block Google. Rate limiting needs your own domain on Cloudflare; the free `pages.dev` address does not have the WAF dashboard. DDoS protection is on by default either way.
3. **Contact form spam.** Your email address is public on the page, so anyone can post to the form service. FormSubmit filters most bots. If spam grows, add Cloudflare Turnstile (free) to the form, or switch `formEndpoint` to a Formspree form with its spam filter.
4. **Downloads.** The installers are not code-signed. The page shows each file's SHA-256 checksum so people can verify the file, and the Setup section explains the warning. Update the checksums every time you replace a file.
5. **Keep secrets out.** Never put passwords, tokens or API keys in this folder. Everything in it is public.

## Before you go live

- **Contact form.** Messages go to `tristanbalane@gmail.com` through FormSubmit (formsubmit.co), a free forwarding service. **One-time step:** after the site is live, open it in your browser, send yourself a test message from the Contact form, then open Gmail and click the **Activate Form** button in the email from FormSubmit. Until you do, nothing is delivered. To use another address, change `email` and `formEndpoint` in `assets/config.js`. If `formEndpoint` is empty, the form opens the visitor's own email app instead.
- **LinkedIn.** Paste your profile address (for example `https://www.linkedin.com/in/your-name`) into `linkedin` in `assets/config.js`. The LinkedIn card on the Contact section stays hidden until you do.
- **License.** If the repository is public, add a `LICENSE` file first. Without one, others have no permission to reuse the code.
- **New app version.** Replace the files in `downloads/`, then in Terminal run `shasum -a 256 downloads/*`. Update the size and checksum in `assets/config.js` and in the two "SHA-256" buttons in `index.html`.
- **Warnings.** The installers are not signed, so macOS and Windows warn the first time. The Setup section already explains how to continue. Signing needs an Apple Developer ID (US$99 a year) and a Windows code-signing certificate, and is optional.

## Test it on your own computer first

On your MacBook, in Terminal, from the site folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in Safari. Press Control + C in Terminal to stop it. (Seeking inside the demo video needs a host that supports range requests, which every host above does. If chapters jump back to the start on this local test, that is why.)
