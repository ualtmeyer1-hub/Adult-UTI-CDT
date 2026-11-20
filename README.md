# Adult UTI Diagnostic & Culture Decision Support Tool (UKHSA / NICE / SIGN 160 / UK SMI B 41)

An offline-capable **Progressive Web App (PWA)** designed for mobile phones, tablets, and desktop browsers to support pre-analytical urine diagnostic stewardship in adults (`≥16` years). Every recommendation displays its source guideline(s) alongside explicit evidence-grading ratings.

---

## Clinical & Guideline Basis

All diagnostic algorithms, dipstick gatekeeping rules, specimen collection standards, and microbiological significance thresholds are synthesised from official UK and Scottish national guidelines:

1. **UKHSA Primary Care Diagnostic Decision Tools (DDTs) v4.0** — *Diagnosis of urinary tract infections: quick reference tools* (UK Health Security Agency, May/July 2025):
   - **Women under 65 years:** Establishes the **'Rule of Three'** (dysuria, new nocturia, cloudy urine: `≥2` key symptoms without vaginal discharge = `>80%` UTI probability, bypassing dipstick testing) [Grade B, OCEBM Level 2b], vaginal discharge exclusion filter (`~80%` non-UTI), and single-symptom dipstick routing.
   - **Adults 65 years and over:** Strict **'DO NOT DIPSTICK'** mandate [Grade A, OCEBM Level 1a], new dysuria alone vs `≥2` localised urinary signs rule [Grade B], and mandatory **PINCH ME** delirium/deterioration screening.
   - **Catheter-Associated UTI (CAUTI):** Strict **'DO NOT DIPSTICK'** mandate [Grade A, OCEBM Level 1a], prohibition of drainage-bag sampling, and catheter replacement prior to sampling/treatment if in situ `>7` days [Grade B].
   - **Men under 65 years:** Mandatory pre-treatment MSU culture (negative dipstick cannot exclude male UTI) and acute prostatitis/STI screening [Grade B].
2. **NICE Guidelines & Quality Standards**:
   - **NG109** (*Urinary tract infection [lower]: antimicrobial prescribing* — supports UKHSA/NICE 3-key-symptom diagnostic rule and empirical management)
   - **NG110** (*Prostatitis [acute]: antimicrobial prescribing*)
   - **NG111** (*Pyelonephritis [acute]: antimicrobial prescribing*)
   - **NG113** (*Urinary tract infection [catheter-associated]: antimicrobial prescribing*)
   - **QS90** (*Urinary tract infections in adults* — Quality Statement 1: Do not use dipstick testing to diagnose UTI in adults `≥65` years)
3. **SIGN 160** — *Management of suspected bacterial lower urinary tract infection in adult women* (Scottish Intercollegiate Guidelines Network, September 2020; ISBN `978-1-909103-80-1`):
   - Establishes 3-day empirical treatment duration in non-pregnant women, non-treatment of asymptomatic bacteriuria (ASB) in non-pregnant adults, older adults, and catheterised patients [Level 1++, Strong Recommendation R], and screening/treatment of antenatal ASB in pregnancy.
4. **UK Standards for Microbiology Investigations (UK SMI B 41, Issue 8.8, December 2025)** — *Investigation of urine*:
   - Cohort-stratified bacterial colony count thresholds (`≥10² cfu/mL` nephrostomy; `≥10³ cfu/mL` males & urostomies; `≥10⁴ cfu/mL` symptomatic females; `≥10⁵ cfu/mL` CAUTI & pregnancy).
   - Red-Top Boric Acid `10 mL` exact fill-line preservation rule and heavy mixed growth (`≥3` species) suppression rules.

---

## Antimicrobial Stewardship Design Features

- **Formulary-Neutral Prescribing Prompts:** All specific drug names are intentionally omitted in favour of **"Follow local empirical policy"** (while retaining evidence-based course durations), allowing seamless use across NHS Boards without regional formulary conflicts.
- **Resistance & Recurrence Modifier:** Ticking **Recurrent UTI / Resistance Risk / Treatment Failure** dynamically updates management advice and generated clinical notes to instruct: *"Follow local empirical policy — base antimicrobial choice on most resistant recent isolate."*
- **Patient & Family QR Guide (`Adults ≥65y`):** Includes an embedded, mobile-friendly leaflet (`patient-guide.html`) explaining why isolated confusion, falls, or dark/smelly urine do not automatically indicate a UTI or require antibiotics, accessible via an instant offline-generated QR code or mobile share sheet.
- **Transparent Evidence Grading:** Every output displays separate evidence ratings for both the **Dipstick/Urinalysis Rule** and the **Symptom/Management Rule**, accompanied by an in-app **Evidence Key** modal explaining Oxford OCEBM, NICE, SIGN, and UK SMI B 41 ratings.

---

## Architecture & Information Governance

- **Zero-Dependency Vanilla Stack:** Built purely with `index.html`, `styles.css`, `app.js`, `manifest.json`, and `sw.js`—no external frameworks, CDNs, or tracking scripts.
- **Privacy by Design:** Executes 100% client-side in the browser. Zero patient-identifiable data (PID) is collected, transmitted, logged, or stored externally. The **Copy Request Details** feature generates concise, 3-point pipe-delimited clinical details for laboratory request forms (`Site & Duration | ?Working Differential | Therapy, Allergies & Risk`) and writes strictly to the local device clipboard.
- **Offline Support:** Uses a Service Worker (`sw.js`) to cache all assets on first visit for uninterrupted offline clinical use.

---

## Deploying as a Mobile App via GitHub Pages

1. **Create a GitHub Repository:**
   - Create a new repository on GitHub (e.g., `adult-uti-decision-support`).
   - Upload all files from this archive (`index.html`, `styles.css`, `app.js`, `manifest.json`, `sw.js`, `README.md`, and `icons/icon.svg`) to the root of the `main` branch.
2. **Enable GitHub Pages:**
   - Go to **Settings → Pages** in your repository.
   - Under **Build and deployment → Source**, select **Deploy from a branch**, choose `main` and `/ (root)`, and click **Save**.
3. **Install on Mobile Home Screens:**
   - **iOS (Safari):** Open the GitHub Pages URL in Safari, tap **Share**, and tap **Add to Home Screen**.
   - **Android (Chrome):** Open the GitHub Pages URL in Chrome, open the menu (`⋮`), and tap **Install app** or **Add to Home screen**.

---

## Clinical Disclaimer

This tool is intended for qualified healthcare professionals to support point-of-care diagnostic stewardship. It does not replace clinical judgement or local NHS Board antimicrobial prescribing formularies. Always assess for systemic sepsis (`NEWS2` / `RESTORE2` / `NICE NG51`).
