(function () {
  "use strict";

  const COHORT_LABELS = {
    fem_u65: "Females <65y (Non-Pregnant)",
    preg: "Pregnancy (Antenatal / Symptomatic)",
    male_u65: "Males <65y",
    older_65: "Older Adults ≥65y",
    cauti: "Catheterised (CAUTI)",
    surgical: "Surgically Altered Urinary Tract"
  };

  const state = {
    cohort: "fem_u65",
    resistanceRisk: false,
    femDischarge: false,
    femUpper: false,
    femDysuria: false,
    femNocturia: false,
    femCloudy: false,
    femOther: false,
    femLe: "neg",
    femNitrite: "neg",
    pregMode: "symp_lower",
    maleSti: false,
    maleProstatitis: false,
    maleUpper: false,
    maleLower: false,
    maleLe: "neg",
    maleNitrite: "neg",
    oldUpper: false,
    oldDysuria: false,
    oldLocalCount: [],
    oldDeliriumOnly: false,
    oldDarkSmellyOnly: false,
    cautiUpper: false,
    cautiLocal: false,
    cautiOver7d: true,
    surgType: "conduit",
    surgSymp: false
  };

  const els = {
    cohortContainer: document.getElementById("cohortContainer"),
    resistanceRiskCheck: document.getElementById("resistanceRiskCheck"),
    verdictCard: document.getElementById("verdictCard"),
    verdictSeverity: document.getElementById("verdictSeverity"),
    verdictCohortBadge: document.getElementById("verdictCohortBadge"),
    verdictTitle: document.getElementById("verdictTitle"),
    verdictSummary: document.getElementById("verdictSummary"),
    verdictDipstick: document.getElementById("verdictDipstick"),
    verdictCulture: document.getElementById("verdictCulture"),
    verdictActions: document.getElementById("verdictActions"),
    evSources: document.getElementById("evSources"),
    evDipGrade: document.getElementById("evDipGrade"),
    evClinGrade: document.getElementById("evClinGrade"),
    verdictNotePreview: document.getElementById("verdictNotePreview"),
    copyNoteBtn: document.getElementById("copyNoteBtn"),
    copyFeedback: document.getElementById("copyFeedback"),
    resetBtn: document.getElementById("resetBtn"),
    gradeKeyBtn: document.getElementById("gradeKeyBtn"),
    inlineKeyLink: document.getElementById("inlineKeyLink"),
    gradeModal: document.getElementById("gradeModal"),
    closeModalBtn: document.getElementById("closeModalBtn")
  };

  function rxInstruction(durationText) {
    if (state.resistanceRisk) {
      return `Follow local empirical policy — base antimicrobial choice on most resistant recent isolate (${durationText}).`;
    }
    return `Follow local empirical policy (${durationText}).`;
  }

  function renderCohortInputs() {
    const c = state.cohort;
    let html = "";

    if (c === "fem_u65") {
      const keyCount = [state.femDysuria, state.femNocturia, state.femCloudy].filter(Boolean).length;
      const showDipstick = !state.femDischarge && !state.femUpper && keyCount === 1;
      html = `
        <div class="card">
          <div class="card-header-row">
            <h2>Females &lt;65 Years: Symptom &amp; Exclusion Triage</h2>
            <span class="rec-tag">UKHSA / NICE 'Rule of Three'</span>
          </div>
          <h3>1. Red Flags &amp; Key Exclusions</h3>
          <label class="checkbox-row">
            <input type="checkbox" id="femUpper" ${state.femUpper ? "checked" : ""} />
            <span><strong>Upper UTI / Pyelonephritis signs:</strong> Loin/flank pain or CVA tenderness WITH fever &ge;37.9&deg;C or rigors.</span>
          </label>
          <label class="checkbox-row">
            <input type="checkbox" id="femDischarge" ${state.femDischarge ? "checked" : ""} />
            <span><strong>New vaginal discharge or vulvovaginal irritation / thrush:</strong> (~80% do NOT have a UTI).</span>
          </label>

          <div class="section-divider">
            <h3>2. UKHSA / NICE Three Key Diagnostic Symptoms (${keyCount}/3 selected)</h3>
            <label class="checkbox-row">
              <input type="checkbox" id="femDysuria" ${state.femDysuria ? "checked" : ""} />
              <span>New-onset <strong>dysuria</strong> (pain/burning passing urine)</span>
            </label>
            <label class="checkbox-row">
              <input type="checkbox" id="femNocturia" ${state.femNocturia ? "checked" : ""} />
              <span>New-onset <strong>nocturia</strong> (waking at night to pass urine)</span>
            </label>
            <label class="checkbox-row">
              <input type="checkbox" id="femCloudy" ${state.femCloudy ? "checked" : ""} />
              <span><strong>Cloudy urine</strong> visible to the naked eye</span>
            </label>
            <label class="checkbox-row">
              <input type="checkbox" id="femOther" ${state.femOther ? "checked" : ""} />
              <span>Other urinary symptoms only (new urgency, frequency, suprapubic tenderness, or visible haematuria)</span>
            </label>
          </div>

          ${showDipstick ? `
          <div class="section-divider">
            <h3>3. Urine Dipstick Result (Indicated for Single Key Symptom)</h3>
            <div class="dipstick-grid">
              <div>
                <span class="field-label">Leukocyte Esterase (LE)</span>
                <div class="segmented">
                  <button type="button" class="seg-btn ${state.femLe === "neg" ? "active" : ""}" data-state="femLe" data-val="neg">Negative</button>
                  <button type="button" class="seg-btn ${state.femLe === "pos" ? "active" : ""}" data-state="femLe" data-val="pos">Positive</button>
                </div>
              </div>
              <div>
                <span class="field-label">Nitrite</span>
                <div class="segmented">
                  <button type="button" class="seg-btn ${state.femNitrite === "neg" ? "active" : ""}" data-state="femNitrite" data-val="neg">Negative</button>
                  <button type="button" class="seg-btn ${state.femNitrite === "pos" ? "active" : ""}" data-state="femNitrite" data-val="pos">Positive</button>
                </div>
              </div>
            </div>
          </div>` : ""}
        </div>`;
    } else if (c === "preg") {
      html = `
        <div class="card">
          <div class="card-header-row">
            <h2>Pregnancy: Antenatal Screening &amp; UTI Triage</h2>
            <span class="rec-tag">SIGN 160 / NICE NG109</span>
          </div>
          <label class="checkbox-row">
            <input type="radio" name="pregMode" value="asb" ${state.pregMode === "asb" ? "checked" : ""} />
            <span><strong>Antenatal Booking Screening (12–16 weeks):</strong> Asymptomatic routine screening or confirmed antenatal Asymptomatic Bacteriuria (ASB).</span>
          </label>
          <label class="checkbox-row">
            <input type="radio" name="pregMode" value="symp_lower" ${state.pregMode === "symp_lower" ? "checked" : ""} />
            <span><strong>Symptomatic Lower UTI in Pregnancy:</strong> Acute dysuria, frequency, urgency, or suprapubic pain without fever/loin pain.</span>
          </label>
          <label class="checkbox-row">
            <input type="radio" name="pregMode" value="upper" ${state.pregMode === "upper" ? "checked" : ""} />
            <span><strong>Suspected Acute Pyelonephritis in Pregnancy:</strong> Loin/flank pain or CVA tenderness WITH fever &ge;37.9&deg;C or rigors.</span>
          </label>
        </div>`;
    } else if (c === "male_u65") {
      html = `
        <div class="card">
          <div class="card-header-row">
            <h2>Males &lt;65 Years: Clinical Triage &amp; Mandatory Culture</h2>
            <span class="rec-tag">UKHSA / NICE NG109 &amp; NG110</span>
          </div>
          <label class="checkbox-row">
            <input type="checkbox" id="maleSti" ${state.maleSti ? "checked" : ""} />
            <span><strong>Penile discharge / Urethritis / STI risk:</strong> Rule out <em>Chlamydia trachomatis</em> / <em>Neisseria gonorrhoeae</em>.</span>
          </label>
          <label class="checkbox-row">
            <input type="checkbox" id="maleProstatitis" ${state.maleProstatitis ? "checked" : ""} />
            <span><strong>Acute Prostatitis signs:</strong> Sudden feverish illness WITH painful voiding, perineal/rectal/low-back pain, haematospermia, or exquisitely tender prostate on gentle DRE.</span>
          </label>
          <label class="checkbox-row">
            <input type="checkbox" id="maleUpper" ${state.maleUpper ? "checked" : ""} />
            <span><strong>Acute Pyelonephritis / Upper UTI:</strong> Loin/flank pain or CVA tenderness WITH fever &ge;37.9&deg;C or rigors.</span>
          </label>
          <label class="checkbox-row">
            <input type="checkbox" id="maleLower" ${state.maleLower ? "checked" : ""} />
            <span><strong>Symptomatic Lower Male UTI:</strong> New dysuria, frequency, urgency, hesitancy, or acute retention without fever.</span>
          </label>

          <div class="section-divider">
            <h3>Optional Dipstick Result (Supporting Only — Negative Dipstick Cannot Exclude Male UTI)</h3>
            <div class="dipstick-grid">
              <div>
                <span class="field-label">Leukocyte Esterase (LE)</span>
                <div class="segmented">
                  <button type="button" class="seg-btn ${state.maleLe === "neg" ? "active" : ""}" data-state="maleLe" data-val="neg">Negative</button>
                  <button type="button" class="seg-btn ${state.maleLe === "pos" ? "active" : ""}" data-state="maleLe" data-val="pos">Positive</button>
                </div>
              </div>
              <div>
                <span class="field-label">Nitrite</span>
                <div class="segmented">
                  <button type="button" class="seg-btn ${state.maleNitrite === "neg" ? "active" : ""}" data-state="maleNitrite" data-val="neg">Negative</button>
                  <button type="button" class="seg-btn ${state.maleNitrite === "pos" ? "active" : ""}" data-state="maleNitrite" data-val="pos">Positive</button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    } else if (c === "older_65") {
      const localItems = [
        "New or worsened urinary incontinence",
        "New-onset urgency",
        "New-onset frequency",
        "New suprapubic pain / tenderness",
        "New visible haematuria"
      ];
      html = `
        <div class="card">
          <div class="ban-banner">
            <strong>STRICT DO NOT DIPSTICK MANDATE (ADULTS &ge;65 YEARS)</strong>
            Dipstick urinalysis is contraindicated and uninformative due to high asymptomatic bacteriuria prevalence (25–50% in care homes; 10–15% in community).
          </div>
          <div class="card-header-row">
            <h2>Older Adults (&ge;65 Years): Symptom Assessment</h2>
            <span class="rec-tag">UKHSA DDT 65+ / SIGN 160 / NICE QS90</span>
          </div>
          <label class="checkbox-row">
            <input type="checkbox" id="oldUpper" ${state.oldUpper ? "checked" : ""} />
            <span><strong>Systemic Sepsis / Upper UTI Red Flags:</strong> Fever &gt;37.9&deg;C (or +1.5&deg;C above baseline), hypothermia &le;36.0&deg;C, rigors, flank/loin pain, or NEWS2 &ge;3.</span>
          </label>
          <label class="checkbox-row">
            <input type="checkbox" id="oldDysuria" ${state.oldDysuria ? "checked" : ""} />
            <span><strong>New-onset dysuria ALONE</strong> (qualifies for UTI diagnosis &amp; culture on its own).</span>
          </label>

          <div class="section-divider">
            <h3>Other Localised Urinary Signs (${state.oldLocalCount.length} selected — &ge;2 required if no dysuria)</h3>
            ${localItems.map((item) => `
              <label class="checkbox-row">
                <input type="checkbox" class="old-local-cb" value="${item}" ${state.oldLocalCount.includes(item) ? "checked" : ""} />
                <span>${item}</span>
              </label>
            `).join("")}
          </div>

          <div class="section-divider">
            <h3>Non-Specific Signs (Do NOT Diagnose UTI in Isolation)</h3>
            <label class="checkbox-row">
              <input type="checkbox" id="oldDeliriumOnly" ${state.oldDeliriumOnly ? "checked" : ""} />
              <span><strong>New confusion / acute delirium / functional decline</strong> WITHOUT localised urinary signs or systemic sepsis.</span>
            </label>
            <label class="checkbox-row">
              <input type="checkbox" id="oldDarkSmellyOnly" ${state.oldDarkSmellyOnly ? "checked" : ""} />
              <span><strong>Dark, cloudy, or malodorous urine</strong> in isolation without pain or fever.</span>
            </label>
          </div>

          ${(state.oldDeliriumOnly || state.oldDarkSmellyOnly) ? `
          <div class="pinch-box">
            <h3>Mandatory PINCH ME Delirium &amp; Deterioration Screen</h3>
            <p style="margin:0;font-size:0.82rem;"><strong>P</strong>ain &bull; <strong>I</strong>nfection (chest/skin/GI) &bull; <strong>N</strong>utrition &bull; <strong>C</strong>onstipation &bull; <strong>H</strong>ydration &bull; <strong>M</strong>edication changes &bull; <strong>E</strong>nvironment</p>
          </div>` : ""}
        </div>`;
    } else if (c === "cauti") {
      html = `
        <div class="card">
          <div class="ban-banner">
            <strong>STRICT DO NOT DIPSTICK &amp; NEVER SAMPLE FROM DRAINAGE BAG</strong>
            Long-term catheters (&gt;1 month) are ~100% colonised with biofilm bacteria. Drainage bag urine reflects stagnant biofilm flora.
          </div>
          <div class="card-header-row">
            <h2>Catheterised Patients (CAUTI)</h2>
            <span class="rec-tag">UKHSA DDT CAUTI / NICE NG113</span>
          </div>
          <label class="checkbox-row">
            <input type="checkbox" id="cautiUpper" ${state.cautiUpper ? "checked" : ""} />
            <span><strong>Upper CAUTI / Urosepsis:</strong> Flank/loin pain or CVA tenderness WITH fever &gt;37.9&deg;C, hypothermia &le;36.0&deg;C, rigors, or NEWS2 &ge;3.</span>
          </label>
          <label class="checkbox-row">
            <input type="checkbox" id="cautiLocal" ${state.cautiLocal ? "checked" : ""} />
            <span><strong>Symptomatic Lower CAUTI:</strong> New visible haematuria, new suprapubic/pelvic pain, fever &gt;37.9&deg;C (+1.5&deg;C baseline) with no other source, or new dysuria/frequency/urgency within 48h of catheter removal.</span>
          </label>
          <div class="section-divider">
            <label class="checkbox-row">
              <input type="checkbox" id="cautiOver7d" ${state.cautiOver7d ? "checked" : ""} />
              <span><strong>Catheter in situ &gt;7 days:</strong> Must be replaced/removed prior to collecting sample and starting antibiotics.</span>
            </label>
          </div>
        </div>`;
    } else if (c === "surgical") {
      html = `
        <div class="card">
          <div class="ban-banner">
            <strong>STRICT DO NOT DIPSTICK &amp; NEVER SAMPLE FROM EXTERNAL POUCH BAG</strong>
            Intestinal segments naturally secrete mucus and harbour bowel flora, invalidating dipsticks and pouch-bag specimens.
          </div>
          <div class="card-header-row">
            <h2>Surgically Altered Urinary Tracts</h2>
            <span class="rec-tag">UK SMI B 41 / UKHSA / EAU</span>
          </div>
          <label class="checkbox-row">
            <input type="radio" name="surgType" value="conduit" ${state.surgType === "conduit" ? "checked" : ""} />
            <span><strong>Ileal Conduit / Urostomy Stoma</strong></span>
          </label>
          <label class="checkbox-row">
            <input type="radio" name="surgType" value="nephrostomy" ${state.surgType === "nephrostomy" ? "checked" : ""} />
            <span><strong>Nephrostomy Tube</strong></span>
          </label>
          <div class="section-divider">
            <label class="checkbox-row">
              <input type="checkbox" id="surgSymp" ${state.surgSymp ? "checked" : ""} />
              <span><strong>Acute Infection Signs Present:</strong> New flank/loin pain, CVA tenderness, stomal/nephrostomy site pain, new visible haematuria, fever &gt;37.9&deg;C, or rigors.</span>
            </label>
          </div>
        </div>`;
    }

    els.cohortContainer.innerHTML = html;
    bindDynamicEvents();
  }

  function bindDynamicEvents() {
    const bindCb = (id, key) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("change", (e) => {
          state[key] = e.target.checked;
          renderCohortInputs();
          evaluate();
        });
      }
    };

    bindCb("femUpper", "femUpper");
    bindCb("femDischarge", "femDischarge");
    bindCb("femDysuria", "femDysuria");
    bindCb("femNocturia", "femNocturia");
    bindCb("femCloudy", "femCloudy");
    bindCb("femOther", "femOther");
    bindCb("maleSti", "maleSti");
    bindCb("maleProstatitis", "maleProstatitis");
    bindCb("maleUpper", "maleUpper");
    bindCb("maleLower", "maleLower");
    bindCb("oldUpper", "oldUpper");
    bindCb("oldDysuria", "oldDysuria");
    bindCb("oldDeliriumOnly", "oldDeliriumOnly");
    bindCb("oldDarkSmellyOnly", "oldDarkSmellyOnly");
    bindCb("cautiUpper", "cautiUpper");
    bindCb("cautiLocal", "cautiLocal");
    bindCb("cautiOver7d", "cautiOver7d");
    bindCb("surgSymp", "surgSymp");

    document.querySelectorAll(".old-local-cb").forEach((cb) => {
      cb.addEventListener("change", () => {
        state.oldLocalCount = Array.from(document.querySelectorAll(".old-local-cb:checked")).map((x) => x.value);
        renderCohortInputs();
        evaluate();
      });
    });

    document.querySelectorAll("input[name='pregMode']").forEach((r) => {
      r.addEventListener("change", (e) => {
        state.pregMode = e.target.value;
        evaluate();
      });
    });

    document.querySelectorAll("input[name='surgType']").forEach((r) => {
      r.addEventListener("change", (e) => {
        state.surgType = e.target.value;
        evaluate();
      });
    });

    document.querySelectorAll(".seg-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state[btn.dataset.state] = btn.dataset.val;
        renderCohortInputs();
        evaluate();
      });
    });
  }

  function evaluate() {
    const c = state.cohort;
    els.verdictCohortBadge.textContent = COHORT_LABELS[c];

    if (c === "fem_u65") {
      const keyCount = [state.femDysuria, state.femNocturia, state.femCloudy].filter(Boolean).length;
      if (state.femUpper) {
        return renderVerdict({
          theme: "verdict-red",
          severity: "ACUTE PYELONEPHRITIS • MANDATORY CULTURE",
          title: "Suspected Upper UTI: Send urgent MSU culture & start empirical therapy",
          summary: "Flank/loin pain with fever ≥37.9°C or rigors indicates acute upper UTI.",
          dipRule: "Dipstick may support diagnosis, but negative results do NOT override clinical pyelonephritis.",
          cultureRule: "MANDATORY pre-treatment MSU culture (Red-Top Boric Acid 10 mL). UK SMI B 41 cut-off: ≥10⁴ cfu/mL.",
          actions: [
            "Send urgent pre-treatment MSU culture prior to antibiotics.",
            rxInstruction("7–10 day upper UTI regimen"),
            "Assess for sepsis (NEWS2) and admit to hospital if systemically unstable or unable to tolerate oral therapy."
          ],
          sources: "UKHSA DDT Women <65 v4.0 • NICE NG111 • SIGN 160 • UK SMI B 41",
          dipGrade: "UKHSA Grade B (OCEBM Level 2a) / SIGN Level 1+",
          clinGrade: "NICE NG111 [Grade Nat] / SIGN Level 1+ [Strong R]"
        });
      }
      if (state.femDischarge) {
        return renderVerdict({
          theme: "verdict-amber",
          severity: "NON-UTI MIMIC (~80% NON-UTI)",
          title: "New vaginal discharge/irritation: Do NOT treat empirically for UTI",
          summary: "Approximately 80% of women presenting with new vaginal discharge or vulvovaginal irritation do not have a UTI.",
          dipRule: "Do NOT rely on dipstick testing; pyuria commonly contaminates vaginal secretions.",
          cultureRule: "Culture not indicated unless urinary symptoms persist after STI/gynaecological assessment.",
          actions: [
            "Route to STI screening (Chlamydia/Gonorrhoea) or gynaecological/thrush assessment.",
            "Advise hydration and symptomatic relief while awaiting alternative diagnosis."
          ],
          sources: "UKHSA DDT Women <65 v4.0 • NICE NG109 • SIGN 160",
          dipGrade: "UKHSA Grade B (OCEBM Level 2b)",
          clinGrade: "UKHSA Grade B / SIGN Level 2++ [Strong R]"
        });
      }
      if (keyCount >= 2) {
        return renderVerdict({
          theme: "verdict-red",
          severity: "RULE OF THREE (≥2 KEY SYMPTOMS) • NO DIPSTICK",
          title: `${keyCount}/3 Key Symptoms present (>80% UTI probability): Bypass dipstick & treat`,
          summary: "Under UKHSA / NICE guidance, ≥2 key symptoms (dysuria, new nocturia, cloudy urine) without vaginal discharge establishes >80% UTI likelihood.",
          dipRule: "DIPSTICK NOT REQUIRED — adds no diagnostic value and delays care.",
          cultureRule: state.resistanceRisk
            ? "MANDATORY pre-treatment MSU culture due to resistance/recurrence risk (UK SMI B 41: ≥10⁴ cfu/mL)."
            : "Routine culture NOT required for uncomplicated first episode unless pregnant or resistance risk.",
          actions: [
            rxInstruction("3-day lower UTI course"),
            state.resistanceRisk ? "Collect MSU in Red-Top Boric Acid tube (fill to 10 mL line) BEFORE starting antibiotics." : "Provide TARGET UTI leaflet and safety-netting if symptoms worsen or fail to improve within 48h."
          ],
          sources: "UKHSA DDT Women <65 v4.0 ('Rule of Three') • NICE NG109 • SIGN 160",
          dipGrade: "UKHSA Grade B (OCEBM Level 2b) / NICE NG109",
          clinGrade: "UKHSA Grade B / NICE NG109 [Grade Nat] / SIGN 160 (3d rx)"
        });
      }
      if (keyCount === 1) {
        const lePos = state.femLe === "pos";
        const nitPos = state.femNitrite === "pos";
        if (nitPos || lePos) {
          return renderVerdict({
            theme: "verdict-red",
            severity: "SINGLE KEY SYMPTOM + POSITIVE DIPSTICK",
            title: `Dipstick supports UTI (LE ${lePos ? "+" : "−"} / Nitrite ${nitPos ? "+" : "−"}): Treat lower UTI`,
            summary: nitPos
              ? "Positive nitrite strongly confirms bacterial UTI."
              : "Positive leukocyte esterase with 1 key urinary symptom makes UTI equally likely.",
            dipRule: "Dipstick indicated for single key symptom; positive result supports treatment.",
            cultureRule: state.resistanceRisk
              ? "MANDATORY pre-treatment MSU culture due to resistance/recurrence risk."
              : "Routine culture NOT required unless recurrent or treatment failure.",
            actions: [
              rxInstruction("3-day lower UTI course"),
              state.resistanceRisk ? "Send pre-treatment MSU culture in Red-Top Boric Acid tube (10 mL)." : "Advise hydration and review if no improvement at 48 hours."
            ],
            sources: "UKHSA DDT Women <65 v4.0 • NICE NG109 • SIGN 160",
            dipGrade: "UKHSA Grade B (OCEBM Level 2b) / SIGN Level 2++",
            clinGrade: "NICE NG109 [Grade Nat] / SIGN Level 1++ [Strong R]"
          });
        }
        return renderVerdict({
          theme: "verdict-green",
          severity: "SINGLE KEY SYMPTOM + NEGATIVE DIPSTICK",
          title: "Dipstick negative (LE − / Nitrite −): UTI less likely — Consider watch & wait",
          summary: "With only 1 key symptom and negative dipstick, bacterial UTI probability is low.",
          dipRule: "Negative LE and Nitrite rules against uncomplicated UTI in single-symptom presentation.",
          cultureRule: state.resistanceRisk
            ? "Consider pre-treatment MSU culture if symptoms persist given resistance/recurrence history."
            : "Do NOT send routine urine culture.",
          actions: [
            "Do NOT prescribe immediate empirical antibiotics.",
            "Advise hydration, analgesia/NSAID trial if appropriate (SIGN 160), and safety-net to return if symptoms worsen."
          ],
          sources: "UKHSA DDT Women <65 v4.0 • NICE NG109 • SIGN 160",
          dipGrade: "UKHSA Grade B (OCEBM Level 2b) / SIGN Level 2++",
          clinGrade: "UKHSA Grade B / SIGN Level 1+ [Conditional R]"
        });
      }
      if (state.femOther) {
        return renderVerdict({
          theme: "verdict-blue",
          severity: "NON-CARDINAL SYMPTOMS ONLY",
          title: "Other urinary symptoms without dysuria/nocturia/cloudy urine: Assess & consider dipstick",
          summary: "Isolated frequency, urgency, or suprapubic discomfort has lower specificity for bacterial cystitis.",
          dipRule: "Perform dipstick urinalysis if UTI remains suspected after excluding non-UTI causes (e.g. GSM, urethritis, stones).",
          cultureRule: state.resistanceRisk ? "Send pre-treatment MSU culture if treating." : "Culture not routinely required unless recurrent/atypical.",
          actions: [
            "Exclude vaginal discharge, STI/urethritis, and genitourinary syndrome of menopause.",
            "If dipstick positive and UTI clinically likely: " + rxInstruction("3-day lower UTI course")
          ],
          sources: "UKHSA DDT Women <65 v4.0 • NICE NG109 • SIGN 160",
          dipGrade: "UKHSA Grade C (OCEBM Level 4)",
          clinGrade: "UKHSA Grade C / SIGN Good Practice Point [✓]"
        });
      }
      return renderVerdict({
        theme: "verdict-neutral",
        severity: "SELECT SYMPTOMS ABOVE",
        title: "Tick the patient's presenting symptoms above",
        summary: "Evaluate exclusions first, then select UKHSA / NICE key symptoms.",
        dipRule: "Dipstick only if 1 key symptom (or non-cardinal symptoms) without vaginal discharge.",
        cultureRule: "Culture reserved for upper UTI, pregnancy, recurrence, or resistance risk.",
        actions: [],
        sources: "UKHSA DDT Women <65 v4.0 • NICE NG109 • SIGN 160",
        dipGrade: "UKHSA Grade B / NICE NG109",
        clinGrade: "UKHSA Grade B / NICE NG109"
      });
    }

    if (c === "preg") {
      if (state.pregMode === "upper") {
        return renderVerdict({
          theme: "verdict-red",
          severity: "PYELONEPHRITIS IN PREGNANCY • URGENT",
          title: "Suspected Upper UTI in Pregnancy: Urgent MSU culture & hospital/obstetric assessment",
          summary: "Acute pyelonephritis in pregnancy carries high maternal and fetal morbidity.",
          dipRule: "Dipstick may support diagnosis, but MUST be accompanied by laboratory culture.",
          cultureRule: "MANDATORY urgent pre-treatment MSU culture + 7–14 day post-treatment test-of-cure culture.",
          actions: [
            "Send urgent pre-treatment MSU culture before antibiotics.",
            "Arrange urgent obstetric/secondary care assessment; " + rxInstruction("7–10 day pregnancy-safe upper UTI regimen")
          ],
          sources: "SIGN 160 • NICE NG111 • UKHSA Quick Tools • UK SMI B 41",
          dipGrade: "UKHSA Grade A / National Standard",
          clinGrade: "SIGN Level 1++ [Strong R] / NICE NG111 [Grade Nat]"
        });
      }
      if (state.pregMode === "asb") {
        return renderVerdict({
          theme: "verdict-amber",
          severity: "ANTENATAL ASB SCREENING • MANDATORY CULTURE",
          title: "Pregnancy Antenatal Screening (12–16w): Confirm with MSU & treat confirmed ASB",
          summary: "Unlike non-pregnant adults, untreated Asymptomatic Bacteriuria (ASB) in pregnancy carries up to 30% risk of pyelonephritis and preterm birth.",
          dipRule: "Dipstick screening requires laboratory MSU culture confirmation before treating ASB.",
          cultureRule: "MANDATORY MSU culture (UK SMI B 41 significance: pure growth ≥10⁵ cfu/mL) + 7–14 day test-of-cure culture.",
          actions: [
            "Submit MSU in Red-Top Boric Acid tube (10 mL fill line).",
            "If confirmed ≥10⁵ cfu/mL on culture: " + rxInstruction("7-day pregnancy-safe targeted course"),
            "Send repeat MSU culture 7–14 days after completing antibiotics to confirm clearance."
          ],
          sources: "SIGN 160 • NICE NG109 • UKHSA Quick Tools • UK SMI B 41",
          dipGrade: "UKHSA Grade A (OCEBM Level 1a)",
          clinGrade: "SIGN Level 1++ [Strong R] / UKHSA Grade A"
        });
      }
      return renderVerdict({
        theme: "verdict-red",
        severity: "SYMPTOMATIC PREGNANCY LUTI • MANDATORY CULTURE",
        title: "Symptomatic Lower UTI in Pregnancy: Mandatory pre-treatment MSU & 7-day therapy",
        summary: "All symptomatic UTIs in pregnancy require laboratory culture confirmation and a 7-day course.",
        dipRule: "Dipstick supports immediate initiation, but NEVER replaces pre-treatment MSU culture.",
        cultureRule: "MANDATORY pre-treatment MSU culture + 7–14 day post-treatment test-of-cure culture.",
        actions: [
          "Collect pre-treatment MSU in Red-Top Boric Acid tube (10 mL line) BEFORE starting therapy.",
          rxInstruction("7-day pregnancy-safe lower UTI course"),
          "Arrange repeat test-of-cure MSU culture 7–14 days post-treatment."
        ],
        sources: "SIGN 160 • NICE NG109 • UKHSA Quick Tools • UK SMI B 41",
        dipGrade: "UKHSA Grade A (OCEBM Level 1a)",
        clinGrade: "SIGN Level 1++ [Strong R] / NICE NG109 [Grade Nat]"
      });
    }

    if (c === "male_u65") {
      if (state.maleSti) {
        return renderVerdict({
          theme: "verdict-amber",
          severity: "EXCLUDE STI / URETHRITIS",
          title: "Penile discharge / STI risk: Send first-void urine / urethral swab for STI PCR",
          summary: "Urethritis caused by Chlamydia trachomatis or Neisseria gonorrhoeae mimics lower UTI in men <65y.",
          dipRule: "LE may be positive in urethritis; dipstick cannot distinguish STI from UTI.",
          cultureRule: "Send first-catch urine for NAAT/PCR (CT/NG) alongside MSU culture if urinary symptoms present.",
          actions: [
            "Perform STI screen (first-void urine NAAT for Chlamydia/Gonorrhoea) and manage per sexual health guidance.",
            "If concurrent bacterial UTI suspected, also send pre-treatment MSU culture."
          ],
          sources: "UKHSA Quick Tools Men <65 • NICE NG109 • UK SMI B 41",
          dipGrade: "UKHSA Grade B (OCEBM Level 2b)",
          clinGrade: "UKHSA Grade B / NICE NG109 [Grade Nat]"
        });
      }
      if (state.maleProstatitis) {
        return renderVerdict({
          theme: "verdict-red",
          severity: "ACUTE PROSTATITIS • 14–28 DAY THERAPY",
          title: "Suspected Acute Prostatitis: Mandatory MSU culture & tissue-penetrating regimen",
          summary: "Feverish urinary illness with pelvic/perineal/rectal pain or tender prostate requires prolonged tissue-penetrating antibiotics.",
          dipRule: "Dipstick typically positive for LE/nitrite; DO NOT perform vigorous prostatic massage (bacteraemia risk).",
          cultureRule: "MANDATORY pre-treatment MSU culture (UK SMI B 41 male threshold: ≥10³ cfu/mL).",
          actions: [
            "Send pre-treatment MSU culture (and blood cultures if systemically unwell/febrile).",
            rxInstruction("14–28 day prostate-penetrating regimen"),
            "Urgent urology referral if acute urinary retention or suspected prostatic abscess."
          ],
          sources: "NICE NG110 • UKHSA Quick Tools Men <65 • UK SMI B 41",
          dipGrade: "UKHSA Grade B / National Standard",
          clinGrade: "NICE NG110 [Grade Nat] / UKHSA Grade B (OCEBM Level 2b)"
        });
      }
      if (state.maleUpper) {
        return renderVerdict({
          theme: "verdict-red",
          severity: "MALE PYELONEPHRITIS • MANDATORY CULTURE",
          title: "Suspected Male Upper UTI: Urgent pre-treatment MSU & upper UTI therapy",
          summary: "Flank/loin pain with fever ≥37.9°C or rigors requires urgent culture and broad upper-tract cover.",
          dipRule: "Dipstick supports diagnosis but does not replace mandatory culture.",
          cultureRule: "MANDATORY urgent pre-treatment MSU culture (UK SMI B 41 threshold: ≥10³ cfu/mL).",
          actions: [
            "Send urgent pre-treatment MSU culture before antibiotics.",
            rxInstruction("7–14 day upper UTI regimen"),
            "Evaluate NEWS2 / sepsis triggers and refer urgently if systemically unstable."
          ],
          sources: "NICE NG111 • UKHSA Quick Tools Men <65 • UK SMI B 41",
          dipGrade: "UKHSA Grade B / National Standard",
          clinGrade: "NICE NG111 [Grade Nat] / UKHSA Grade B (OCEBM Level 2a)"
        });
      }
      if (state.maleLower) {
        const dipLabel = `LE ${state.maleLe === "pos" ? "+" : "−"} / Nitrite ${state.maleNitrite === "pos" ? "+" : "−"}`;
        return renderVerdict({
          theme: "verdict-red",
          severity: "MALE LOWER UTI • MANDATORY MSU CULTURE",
          title: `Symptomatic Male Lower UTI (${dipLabel}): Mandatory MSU culture & 7-day course`,
          summary: "UTI is less common in men <65y and frequently linked to anatomical/functional pathology; negative dipsticks CANNOT exclude male UTI.",
          dipRule: "Dipstick may support diagnosis if positive, but NEGATIVE dipstick CANNOT rule out UTI in males.",
          cultureRule: "MANDATORY pre-treatment MSU culture in ALL symptomatic men (UK SMI B 41 low-count threshold: ≥10³ cfu/mL).",
          actions: [
            "Collect pre-treatment MSU in Red-Top Boric Acid tube (10 mL line) BEFORE starting antibiotics.",
            rxInstruction("7-day male lower UTI course"),
            "Review culture/AST at 48h; refer to Urology if recurrent (≥2 episodes in 6m) or voiding abnormality."
          ],
          sources: "UKHSA Quick Tools Men <65 • NICE NG109 • UK SMI B 41",
          dipGrade: "UKHSA Grade B (Negative dipstick does not exclude)",
          clinGrade: "NICE NG109 [Grade Nat] / UKHSA Grade B (OCEBM Level 2b)"
        });
      }
      return renderVerdict({
        theme: "verdict-neutral",
        severity: "SELECT MALE PRESENTATION",
        title: "Select the patient's presenting clinical scenario above",
        summary: "All symptomatic male UTIs require a pre-treatment MSU culture (UK SMI B 41 threshold ≥10³ cfu/mL).",
        dipRule: "Negative dipstick CANNOT rule out UTI in males.",
        cultureRule: "MANDATORY pre-treatment MSU culture for all symptomatic male UTIs.",
        actions: [],
        sources: "UKHSA Quick Tools Men <65 • NICE NG109 / NG110 / NG111 • UK SMI B 41",
        dipGrade: "UKHSA Grade B",
        clinGrade: "NICE NG109 / NG110 [Grade Nat]"
      });
    }

    if (c === "older_65") {
      if (state.oldUpper) {
        return renderVerdict({
          theme: "verdict-red",
          severity: "OLDER ADULT SEPSIS / UPPER UTI • DO NOT DIPSTICK",
          title: "Systemic Sepsis / Upper UTI Red Flags: Urgent pre-treatment culture & clinical review",
          summary: "Fever >37.9°C (+1.5°C baseline), hypothermia ≤36.0°C, rigors, or flank pain requires urgent sepsis/upper-UTI management.",
          dipRule: "BANNED — Do NOT dipstick urine in adults ≥65 years.",
          cultureRule: "MANDATORY urgent pre-treatment MSU/clean-catch culture prior to antibiotics (do not delay if septic).",
          actions: [
            "Send urgent pre-treatment urine culture (Red-Top Boric Acid 10 mL) and blood cultures if septic.",
            rxInstruction("7–10 day upper UTI / sepsis regimen"),
            "Arrange urgent GP/ANP/acute hospital assessment if NEWS2 ≥3 or haemodynamically unstable."
          ],
          sources: "UKHSA DDT Adults 65+ v4.0 • SIGN 160 • NICE QS90 • UK SMI B 41",
          dipGrade: "UKHSA Grade A (OCEBM Level 1a) / SIGN Level 1++ [Strong R]",
          clinGrade: "UKHSA Grade B / Grade E (Hypothermia ≤36.0°C)"
        });
      }
      if (state.oldDysuria || state.oldLocalCount.length >= 2) {
        const triggerDesc = state.oldDysuria
          ? "New-onset dysuria alone"
          : `${state.oldLocalCount.length} localised urinary signs (${state.oldLocalCount.join(", ")})`;
        return renderVerdict({
          theme: "verdict-red",
          severity: "QUALIFYING UTI SYMPTOMS • DO NOT DIPSTICK",
          title: `${triggerDesc}: Send pre-treatment culture & treat UTI`,
          summary: "In adults ≥65y, new dysuria alone OR ≥2 new localised urinary symptoms meets diagnostic threshold without dipsticking.",
          dipRule: "BANNED — Do NOT dipstick urine (ASB prevalence up to 50% in care homes).",
          cultureRule: "MANDATORY pre-treatment MSU/clean-catch culture due to elevated antimicrobial resistance in older adults.",
          actions: [
            "Collect pre-treatment urine in Red-Top Boric Acid tube (fill strictly to 10 mL line) BEFORE starting antibiotics.",
            rxInstruction("3-day course for females / 7-day course for males"),
            "Review culture sensitivities at 48–72 hours."
          ],
          sources: "UKHSA DDT Adults 65+ v4.0 • SIGN 160 • NICE NG109 / QS90 • UK SMI B 41",
          dipGrade: "UKHSA Grade A (OCEBM Level 1a) / NICE QS90",
          clinGrade: "UKHSA Grade B (OCEBM Level 2b) / SIGN Level 1++ [Strong R]"
        });
      }
      if (state.oldLocalCount.length === 1 || state.oldDeliriumOnly || state.oldDarkSmellyOnly) {
        return renderVerdict({
          theme: "verdict-green",
          severity: "DO NOT DIPSTICK • DO NOT CULTURE • DO NOT TREAT",
          title: "Insufficient criteria for UTI: Execute PINCH ME screen, hydrate & observe",
          summary: "Isolated delirium/confusion, dark/malodorous urine, or a single non-dysuria symptom does NOT justify UTI antibiotics or culture.",
          dipRule: "BANNED — Dipsticking leads to false-positive ASB treatment and C. difficile / AMR harm.",
          cultureRule: "DO NOT SEND CULTURE unless new dysuria, ≥2 localised signs, or systemic sepsis indicators develop.",
          actions: [
            "Complete the PINCH ME screen (Pain, Infection, Nutrition, Constipation, Hydration, Medication, Environment).",
            "Encourage oral fluid intake (hydration trial) and address reversible triggers.",
            "Monitor closely and reassess within 24 hours."
          ],
          sources: "UKHSA DDT Adults 65+ v4.0 • SIGN 160 • NICE QS90",
          dipGrade: "UKHSA Grade A (OCEBM Level 1a) / SIGN Level 1++ [Strong R]",
          clinGrade: "UKHSA Grade A / SIGN Level 1++ [Strong R]"
        });
      }
      return renderVerdict({
        theme: "verdict-neutral",
        severity: "DO NOT DIPSTICK IN ≥65 YEARS",
        title: "Select resident/patient signs above",
        summary: "Diagnosis in ≥65y relies strictly on clinical symptoms (new dysuria alone or ≥2 localised signs), never dipsticks.",
        dipRule: "BANNED — Do NOT use urine dipsticks in adults ≥65 years.",
        cultureRule: "Send pre-treatment culture ONLY when prescribing antibiotics for qualifying symptoms.",
        actions: [],
        sources: "UKHSA DDT Adults 65+ v4.0 • SIGN 160 • NICE QS90",
        dipGrade: "UKHSA Grade A (OCEBM Level 1a)",
        clinGrade: "UKHSA Grade B / SIGN Level 1++"
      });
    }

    if (c === "cauti") {
      if (state.cautiUpper || state.cautiLocal) {
        const isUpper = state.cautiUpper;
        return renderVerdict({
          theme: "verdict-red",
          severity: isUpper ? "UPPER CAUTI / UROSEPSIS • DO NOT DIPSTICK" : "SYMPTOMATIC CAUTI • DO NOT DIPSTICK",
          title: isUpper
            ? "Suspected Upper CAUTI / Urosepsis: Replace catheter, send port culture & treat"
            : "Symptomatic Lower CAUTI: Replace catheter if >7d, sample from port & treat",
          summary: "True CAUTI requires systemic fever/rigors or localised suprapubic/flank pain or new visible haematuria.",
          dipRule: "BANNED — Do NOT dipstick catheterised urine (~100% colonised after 1 month).",
          cultureRule: "MANDATORY pre-treatment culture aspirated aseptically from needleless sampling port (NEVER drainage bag). UK SMI B 41 cut-off: ≥10⁵ cfu/mL.",
          actions: [
            state.cautiOver7d
              ? "Catheter in situ >7 days: REPLACE (or remove) catheter BEFORE collecting sample from the new catheter port and starting antibiotics."
              : "Disinfect needleless sampling port with 70% alcohol wipe, air-dry 15s, and aspirate 10 mL into Red-Top Boric Acid tube.",
            rxInstruction(isUpper ? "7–14 day upper CAUTI regimen" : "7-day CAUTI regimen"),
            isUpper ? "Assess NEWS2 / sepsis triggers and arrange urgent hospital admission if unstable." : "Review culture AST at 48h (note: UK SMI B 41 suppresses AST for ≥3-organism mixtures)."
          ],
          sources: "UKHSA DDT CAUTI v4.0 • SIGN 160 • NICE NG113 • UK SMI B 41",
          dipGrade: "UKHSA Grade A (OCEBM Level 1a)",
          clinGrade: "NICE NG113 [Grade Nat] / UKHSA Grade B (OCEBM Level 2a/2b)"
        });
      }
      return renderVerdict({
        theme: "verdict-green",
        severity: "ASYMPTOMATIC COLONISATION • DO NOT TREAT",
        title: "No CAUTI symptoms selected: Do NOT dipstick, culture, or prescribe antibiotics",
        summary: "Cloudy or malodorous catheter urine without fever or localising pain represents harmless biofilm colonisation.",
        dipRule: "BANNED — Do NOT dipstick catheterised urine.",
        cultureRule: "BANNED — Do NOT send routine surveillance cultures in asymptomatic catheterised patients.",
        actions: [
          "Reassure and observe; do NOT prescribe antibiotics (antibiotics fail to clear biofilm and drive resistance).",
          "Check catheter drainage flow, prevent kinking, and encourage oral hydration."
        ],
        sources: "UKHSA DDT CAUTI v4.0 • SIGN 160 • NICE QS90 • UK SMI B 41",
        dipGrade: "UKHSA Grade A (OCEBM Level 1a)",
        clinGrade: "SIGN Level 1++ [Strong R] / UKHSA Grade A"
      });
    }

    if (c === "surgical") {
      const isNeph = state.surgType === "nephrostomy";
      const label = isNeph ? "Nephrostomy Tube" : "Ileal Conduit / Urostomy";
      if (state.surgSymp) {
        return renderVerdict({
          theme: "verdict-red",
          severity: `${label.toUpperCase()} INFECTION • DO NOT DIPSTICK`,
          title: `Symptomatic ${label} Infection: Aseptic direct sampling & targeted therapy`,
          summary: "Fever >37.9°C, rigors, flank/loin pain, stomal tenderness, or new haematuria warrants pre-treatment culture and therapy.",
          dipRule: "BANNED — Dipsticks are completely invalidated by intestinal mucus and colonising bowel flora.",
          cultureRule: isNeph
            ? "MANDATORY pre-treatment culture aspirated aseptically from nephrostomy sampling port (UK SMI B 41 cut-off: ≥10² cfu/mL)."
            : "MANDATORY pre-treatment culture via sterile stomal catheterisation 2–5 cm into stoma after saline cleanse — NEVER from pouch bag (UK SMI B 41 cut-off: ≥10³ cfu/mL).",
          actions: [
            isNeph
              ? "Disinfect nephrostomy sampling port with 70% alcohol wipe and aspirate 10 mL into Red-Top Boric Acid tube. Exclude mechanical tube blockage."
              : "Remove external appliance pouch, cleanse stoma with sterile saline, pass sterile catheter 2–5 cm into stoma, and fill Red-Top Boric Acid tube to 10 mL line.",
            rxInstruction("7–14 day upper/complicated UTI regimen"),
            "Seek specialist urology/microbiology advice if systemically septic or recurrent."
          ],
          sources: "UK SMI B 41 (Issue 8.8) • UKHSA Quick Tools • EAU Urological Infections Guidelines",
          dipGrade: "UK SMI B 41 [National Standard] / UKHSA Grade E",
          clinGrade: "UK SMI B 41 [National Standard] / EAU Grade B"
        });
      }
      return renderVerdict({
        theme: "verdict-green",
        severity: "ASYMPTOMATIC COLONISATION • DO NOT SAMPLE",
        title: `Asymptomatic ${label}: Do NOT dipstick, culture, or treat`,
        summary: "Mucus strands, cloudy appearance, or malodour in a urostomy/conduit without fever or flank/stomal pain is normal.",
        dipRule: "BANNED — Dipstick urinalysis is invalid in urological diversions.",
        cultureRule: "DO NOT culture asymptomatic urostomy or nephrostomy urine.",
        actions: [
          "Reassure and observe; encourage oral hydration and routine appliance/stoma hygiene.",
          "Never treat asymptomatic colonisation in ileal conduits or nephrostomies."
        ],
        sources: "UK SMI B 41 (Issue 8.8) • UKHSA Quick Tools",
        dipGrade: "UK SMI B 41 [National Standard]",
        clinGrade: "UK SMI B 41 [National Standard] / UKHSA Grade E"
      });
    }
  }

  function renderVerdict({ theme, severity, title, summary, dipRule, cultureRule, actions, sources, dipGrade, clinGrade }) {
    els.verdictCard.className = `verdict-card ${theme}`;
    els.verdictSeverity.textContent = severity;
    els.verdictTitle.textContent = title;
    els.verdictSummary.textContent = summary;
    els.verdictDipstick.textContent = dipRule;
    els.verdictCulture.textContent = cultureRule;
    els.evSources.textContent = sources;
    els.evDipGrade.textContent = dipGrade;
    els.evClinGrade.textContent = clinGrade;

    els.verdictActions.innerHTML = "";
    actions.forEach((a) => {
      const li = document.createElement("li");
      li.textContent = a;
      els.verdictActions.appendChild(li);
    });

    const noteLines = [
      `Adult UTI Diagnostic Triage | Cohort: ${COHORT_LABELS[state.cohort]}${state.resistanceRisk ? " | Resistance/Recurrence Risk: YES" : ""}`,
      `• Assessment: ${title}`,
      `• Dipstick Rule: ${dipRule}`,
      `• Culture Rule: ${cultureRule}`,
      actions.length ? `• Plan: ${actions.join(" ")}` : ""
    ].filter(Boolean).join("\n");

    els.verdictNotePreview.textContent = noteLines;
    els.verdictNotePreview.classList.remove("hidden");
    els.copyFeedback.textContent = "";
  }

  document.querySelectorAll(".cohort-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.cohort = btn.dataset.cohort;
      document.querySelectorAll(".cohort-btn").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-selected", active ? "true" : "false");
      });
      renderCohortInputs();
      evaluate();
    });
  });

  els.resistanceRiskCheck.addEventListener("change", (e) => {
    state.resistanceRisk = e.target.checked;
    evaluate();
  });

  const openModal = () => els.gradeModal.classList.remove("hidden");
  const closeModal = () => els.gradeModal.classList.add("hidden");
  els.gradeKeyBtn.addEventListener("click", openModal);
  els.inlineKeyLink.addEventListener("click", openModal);
  els.closeModalBtn.addEventListener("click", closeModal);
  els.gradeModal.addEventListener("click", (e) => {
    if (e.target === els.gradeModal) closeModal();
  });

  els.copyNoteBtn.addEventListener("click", async () => {
    const text = els.verdictNotePreview.textContent;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      els.copyFeedback.textContent = "Copied to clipboard";
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      els.copyFeedback.textContent = "Copied to clipboard";
    }
  });

  els.resetBtn.addEventListener("click", () => {
    state.resistanceRisk = false;
    state.femDischarge = false;
    state.femUpper = false;
    state.femDysuria = false;
    state.femNocturia = false;
    state.femCloudy = false;
    state.femOther = false;
    state.femLe = "neg";
    state.femNitrite = "neg";
    state.pregMode = "symp_lower";
    state.maleSti = false;
    state.maleProstatitis = false;
    state.maleUpper = false;
    state.maleLower = false;
    state.maleLe = "neg";
    state.maleNitrite = "neg";
    state.oldUpper = false;
    state.oldDysuria = false;
    state.oldLocalCount = [];
    state.oldDeliriumOnly = false;
    state.oldDarkSmellyOnly = false;
    state.cautiUpper = false;
    state.cautiLocal = false;
    state.cautiOver7d = true;
    state.surgType = "conduit";
    state.surgSymp = false;

    els.resistanceRiskCheck.checked = false;
    renderCohortInputs();
    evaluate();
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }

  renderCohortInputs();
  evaluate();
})();
