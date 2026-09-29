

const API = "http://127.0.0.1:8081";

const OFFICIAL_CONTACT =
    "https://www.whatsapp.com/contact/";

let currentReport = "";
let currentType = "";
let accountType = "messenger";


const MESSENGER_EMAILS = [
    "support@support.whatsapp.com",
    "support@whatsapp.com",
    "abuse@support.whatsapp.com",
    "privacy@support.whatsapp.com"
];

const BUSINESS_EMAILS = [
    "android_web@support.whatsapp.com",
    "Smb@support.whatsapp.com",
    "Accessibility@support.whatsapp.com",
    "Support@support.whatsapp.com",
    "Support@whatsapp.com"
];


const REPORT_TYPES = {

    spam: {
        label: "SPAM",
        message:
            "Je souhaite signaler ce numéro pour des messages indésirables ou du spam."
    },

    abus: {
        label: "ABUS / HARCÈLEMENT",
        message:
            "Je souhaite signaler ce numéro pour un comportement abusif ou du harcèlement."
    },

    fraude: {
        label: "FRAUDE / ARNAQUE",
        message:
            "Je souhaite signaler ce numéro pour un comportement suspect lié à une fraude ou une arnaque."
    },

    usurpation: {
        label: "USURPATION D'IDENTITÉ",
        message:
            "Je souhaite signaler ce numéro pour une possible usurpation d'identité."
    },

    autre: {
        label: "AUTRE",
        message:
            "Je souhaite signaler ce numéro pour un motif nécessitant une vérification."
    }

};


function selectAccountType(type){

    accountType = type;

    const messengerBtn =
        document.getElementById("messengerBtn");

    const businessBtn =
        document.getElementById("businessBtn");

    if(!messengerBtn || !businessBtn){
        return;
    }

    messengerBtn.classList.toggle(
        "active",
        type === "messenger"
    );

    businessBtn.classList.toggle(
        "active",
        type === "business"
    );
}


function normalizeTarget(value){

    return String(value || "")
        .trim()
        .replace(/[^\d+]/g, "");
}


function escapeHTML(value){

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function showStatus(message){

    const box =
        document.getElementById("status");

    if(!box){
        return;
    }

    box.style.display = "block";
    box.innerHTML = message;
}


function openSupport(type){

    const targetInput = document.getElementById("target");

    if(!targetInput){
        return;
    }

    const target = normalizeTarget(targetInput.value);

    if(!target){
        targetInput.classList.add("field-error");
        showStatus("❌ Veuillez entrer le numéro ou la cible.");
        targetInput.focus();
        return;
    }

    if(target.length < 7){
        targetInput.classList.add("field-error");
        showStatus("❌ La cible semble trop courte.");
        targetInput.focus();
        return;
    }

    targetInput.classList.remove("field-error");

    currentType = type;

    const accountLabel =
        accountType === "business"
            ? "WhatsApp Business"
            : "WhatsApp Messenger";

    const date = new Date().toLocaleString("fr-FR");

    const supports = {

        spam: `
Bonjour WhatsApp,

Je souhaite signaler ce numéro pour une activité pouvant correspondre à du spam ou à la diffusion répétée de liens non sollicités.

NUMÉRO CIBLÉ : +224XXXXXXXXX 📱

LIENS À VÉRIFIER :
https://xgore.net/brutal-axe-murder-shocks-rural-vargem-grande-man-decapitated-in-savage-attack/

https://www.xnxx.com/search/gold/video+porno+americain?xsc=pofs

Les liens associés au signalement sont fournis afin de permettre à vos équipes de vérifier le contenu et le contexte.

Merci de vérifier ce compte ainsi que son activité et de prendre les mesures appropriées si une violation de vos règles est constatée.

Cordialement.
`,

        abus: `
Bonjour WhatsApp,

Je souhaite signaler ce compte pour des activités pouvant relever de l’abus, du harcèlement et de comportements nuisibles.

Numéro concerné :
+224XXXXXXXXX

Je vous demande de vérifier les éléments associés à ce compte ainsi que son activité et de prendre les mesures appropriées si une violation de vos règles est constatée.

Ce signalement est effectué de bonne foi afin de contribuer à la sécurité des utilisateurs.

Cordialement.
`,

        fraude: `
OBJET : Signalement d’une activité présumée frauduleuse

Bonjour l’équipe WhatsApp,

Je souhaite signaler le numéro indiqué ci-dessus pour une activité que je considère comme potentiellement frauduleuse.

NUMÉRO CONCERNÉ : +224XXXXXXXXX 📱

Ce compte aurait contacté des utilisateurs dans le but de les tromper, notamment en utilisant de fausses informations, des promesses trompeuses ou des demandes liées à des paiements et à des informations personnelles.

Je vous demande de vérifier les éléments ainsi que l’activité du compte et de prendre les mesures appropriées si une activité frauduleuse est constatée.

Ce signalement est effectué de bonne foi afin de contribuer à la protection des utilisateurs contre les escroqueries et les tentatives de fraude.

Cordialement.
`,

        usurpation: `
OBJET : Demande urgente de désactivation temporaire du compte WhatsApp

NUMÉRO CONCERNÉ : +224XXXXXXXXX 📱

Bonjour l’équipe WhatsApp,

Mon téléphone a été volé et je crains que mon compte WhatsApp associé à ce numéro puisse être consulté ou utilisé sans mon autorisation.

Je souhaite donc demander la désactivation temporaire de mon compte WhatsApp associé au numéro indiqué ci-dessus, afin d’empêcher tout accès ou toute activité non autorisée.

Je suis le propriétaire légitime de ce numéro et cette demande est effectuée pour des raisons de sécurité, le temps que je puisse récupérer l’accès à mon compte.

Merci de désactiver temporairement le compte WhatsApp associé à ce numéro et de m’indiquer si des informations ou une vérification supplémentaire sont nécessaires.

Cordialement.
`,

        autre: `
OBJET : Signalement d’une activité nuisible

NUMÉRO CIBLÉ : +224XXXXXXXXX 📱

Ce numéro diffuse du contenu pornographique non sollicité, y compris du contenu explicite et des images inappropriées. Les contenus sont envoyés à des mineurs.

🔍 PREUVES ET ÉLÉMENTS CONCRETS :

1. Capture d'écran des messages reçus : https://imgur.com/screenshot37468
2. Enregistrement des conversations : https://drive.google.com/evidence5493
3. Journal des appels : https://docs.google.com/logs18355
4. Témoignages de victimes : https://docs.google.com/testimonies7471
5. Analyse des métadonnées : https://drive.google.com/metadata77419
6. Historique des interactions : https://docs.google.com/history90208
7. Rapport de la communauté : https://docs.google.com/community26325
8. Preuves de l'activité frauduleuse : https://drive.google.com/fraud23708
9. Enregistrement vidéo des activités : https://youtube.com/watch?v=tpglsok2ro
10. Analyse IP et géolocalisation : https://docs.google.com/geo27859
11. Rapport de l'opérateur téléphonique : https://docs.google.com/operator24126
12. Preuves de l'identité réelle : https://drive.google.com/identity51000

Je soussigné, utilisateur de WhatsApp, déclare sur l'honneur que le numéro +224XXXXXXXXX est impliqué dans des activités nuisibles et illégales.

Je demande officiellement que WhatsApp examine ce compte et prenne les mesures appropriées si une violation est constatée.

Ce signalement est fait de bonne foi et dans le but de protéger la communauté WhatsApp.

Cordialement.
`
    };

    const reportType =
        REPORT_TYPES[type] || REPORT_TYPES.autre;

    let support =
        supports[type] || supports.autre;

    /* Remplacement automatique du numéro */
    support = support.replace(
        /\+224XXXXXXXXX/g,
        target
    );

    currentReport = support.trim();

    const card = document.querySelector(".sadeus-form-card");

    if(!card){
        return;
    }

    card.querySelectorAll(
        ":scope > *:not(#dynamicSupport)"
    ).forEach(element => {
        element.style.display = "none";
    });

    let reportBox =
        document.getElementById("dynamicSupport");

    if(!reportBox){
        reportBox = document.createElement("div");
        reportBox.id = "dynamicSupport";
        reportBox.className = "report-box";
        card.appendChild(reportBox);
    }

    reportBox.style.display = "block";

    reportBox.innerHTML = `
        <div class="support-screen">
        <div class="support-note">
    ⚠️ NB : Les supports intégrés au site sont des modèles. Si vous constatez qu’ils ne donnent plus les résultats que vous recherchez, n’hésitez pas à les modifier et à utiliser vos propres supports, adaptés à votre situation.
</div> 
            <button
                type="button"
                id="backToCategories"
                class="back-category-button">
                ← RETOUR
            </button>

            <div class="support-heading">
                <span>📄</span>
                <div>
                    <small>SIGNALER</small>
                    <h2>${escapeHTML(reportType.label)}</h2>
                </div>
            </div>

            <div class="support-divider"></div>

            <div class="status">
                Numéro ciblé :
                <strong>${escapeHTML(target)}</strong>
            </div>

            <div class="language-selector">
                <label>LANGUE DU SUPPORT</label>

                <div class="language-buttons">
                    <button type="button" class="language-button active" data-language="fr">🇫🇷 Français</button>
                    <button type="button" class="language-button" data-language="en">🇬🇧 English</button>
                    <button type="button" class="language-button" data-language="ar">🇸🇦 العربية</button>
                </div>
            </div>

            <div class="field-group" style="margin-top:16px;">
                <label>SUPPORT</label>
                <textarea id="generatedReport" readonly>${escapeHTML(currentReport)}</textarea>
            </div>

            <button
                type="button"
                class="sadeus-main-button"
                id="launchReportButton">
                <span>LANCER LE SIGNALEMENT</span>
                <b>→</b>
            </button>

        </div>
    `;

    document.getElementById("backToCategories").onclick =
        backToCategories;


    /* ===== TRADUCTION DU SUPPORT ===== */

    const translatedSupports = {

        en: {
            spam: `Hello WhatsApp,

I would like to report this number for activity that may constitute spam or repeated distribution of unsolicited links.

NUMBER CONCERNED: +224XXXXXXXXX 📱

Please review this account and its activity and take appropriate action if a violation of your rules is found.

Regards.`,

            abus: `Hello WhatsApp,

I would like to report this account for activities that may constitute abuse, harassment, or harmful behavior.

NUMBER CONCERNED:
+224XXXXXXXXX

Please review the information associated with this account and its activity and take appropriate action if a violation of your rules is found.

This report is made in good faith to help contribute to user safety.

Regards.`,

            fraude: `SUBJECT: Report of suspected fraudulent activity

Hello WhatsApp Team,

I would like to report the number indicated above for activity that I consider potentially fraudulent.

NUMBER CONCERNED: +224XXXXXXXXX 📱

This account may have contacted users with the intention of deceiving them, including through false information, misleading promises, or requests involving payments or personal information.

Please review the relevant information and account activity and take appropriate action if fraudulent activity is confirmed.

This report is made in good faith to help protect users from scams and attempted fraud.

Regards.`,

            usurpation: `SUBJECT: Urgent request for temporary WhatsApp account deactivation

NUMBER CONCERNED: +224XXXXXXXXX 📱

Hello WhatsApp Team,

My phone has been stolen and I am concerned that the WhatsApp account associated with this number may be accessed or used without my authorization.

I would therefore like to request the temporary deactivation of my WhatsApp account associated with the number above.

I am the legitimate owner of this number and this request is made for security reasons while I recover access to my account.

Please let me know if any additional information or verification is required.

Regards.`
        },

        ar: {
            spam: `مرحبًا WhatsApp،

أود الإبلاغ عن هذا الرقم بسبب نشاط قد يتوافق مع الرسائل المزعجة أو الإرسال المتكرر لروابط غير مرغوب فيها.

الرقم المعني: +224XXXXXXXXX 📱

أرجو منكم التحقق من هذا الحساب ونشاطه واتخاذ الإجراءات المناسبة إذا ثبت وجود مخالفة لقواعدكم.

مع خالص التحية.`,

            abus: `مرحبًا WhatsApp،

أود الإبلاغ عن هذا الحساب بسبب أنشطة قد تتعلق بالإساءة أو المضايقة أو السلوكيات الضارة.

الرقم المعني:
+224XXXXXXXXX

أرجو منكم مراجعة المعلومات المرتبطة بهذا الحساب ونشاطه واتخاذ الإجراءات المناسبة إذا ثبت وجود مخالفة لقواعدكم.

تم تقديم هذا البلاغ بحسن نية للمساهمة في حماية المستخدمين.

مع خالص التحية.`,

            fraude: `الموضوع: الإبلاغ عن نشاط يُشتبه في كونه احتياليًا

مرحبًا فريق WhatsApp،

أود الإبلاغ عن الرقم المذكور أعلاه بسبب نشاط أعتبره احتياليًا بشكل محتمل.

الرقم المعني: +224XXXXXXXXX 📱

قد يكون هذا الحساب قد تواصل مع مستخدمين بهدف خداعهم، بما في ذلك استخدام معلومات كاذبة أو وعود مضللة أو طلبات تتعلق بالمدفوعات والمعلومات الشخصية.

أرجو منكم التحقق من المعلومات ونشاط الحساب واتخاذ الإجراءات المناسبة إذا ثبت وجود نشاط احتيالي.

تم تقديم هذا البلاغ بحسن نية للمساهمة في حماية المستخدمين من عمليات الاحتيال.

مع خالص التحية.`,

            usurpation: `الموضوع: طلب عاجل لتعطيل حساب WhatsApp مؤقتًا

الرقم المعني: +224XXXXXXXXX 📱

مرحبًا فريق WhatsApp،

تمت سرقة هاتفي وأخشى أن يتم الوصول إلى حساب WhatsApp المرتبط بهذا الرقم أو استخدامه دون إذني.

أود طلب تعطيل حساب WhatsApp المرتبط بالرقم المذكور مؤقتًا لأسباب أمنية.

أنا المالك الشرعي لهذا الرقم، وأطلب تعطيل الحساب مؤقتًا إلى حين استعادة الوصول إليه.

يرجى إخباري إذا كانت هناك حاجة إلى أي معلومات أو عملية تحقق إضافية.

مع خالص التحية.`
        }
    };

    document.querySelectorAll(".language-button").forEach(button => {

        button.onclick = () => {

            const language =
                button.getAttribute("data-language");

            let translated = currentReport;

            if(language === "en" || language === "ar"){

                const group =
                    translatedSupports[language];

                if(group && group[type]){
                    translated =
                        group[type].replace(
                            /\+224XXXXXXXXX/g,
                            target
                        );
                }
            }

            currentReport = translated;

            const textarea =
                document.getElementById("generatedReport");

            if(textarea){
                textarea.value = currentReport;
            }

            document.querySelectorAll(".language-button")
                .forEach(btn => {
                    btn.classList.remove("active");
                });

            button.classList.add("active");
        };
    });

    document.getElementById("launchReportButton").onclick =
        launchReport;

    saveLocalReport(target, type, reportType.label);
}


function backToCategories(){

    const card = document.querySelector(".sadeus-form-card");

    if(!card){
        return;
    }

    const reportBox =
        document.getElementById("dynamicSupport");

    if(reportBox){
        reportBox.style.display = "none";
    }

    /* PAGE 2 → PAGE 1 */

    card.querySelectorAll(
        ":scope > *:not(#dynamicSupport)"
    ).forEach(element => {
        element.style.display = "";
    });

    currentReport = "";
    currentType = "";
}

function launchReport(){

    if(!currentReport){
        showStatus("❌ Aucun support préparé.");
        return;
    }

    const reportBox =
        document.getElementById("dynamicSupport");

    if(!reportBox){
        return;
    }

    reportBox.innerHTML = `
        <div class="support-screen">
        <div class="support-note">
    ⚠️ NB : Les supports intégrés au site sont des modèles. Si vous constatez qu’ils ne donnent plus les résultats que vous recherchez, n’hésitez pas à les modifier et à utiliser vos propres supports, adaptés à votre situation.
</div>
            <button
                type="button"
                id="backToSupport"
                class="back-category-button">
                ← RETOUR
            </button>

            <div class="support-heading">
                <span>⚡</span>
                <div>
                    <small>ACTION</small>
                    <h2>CHOISIR UN MOYEN</h2>
                </div>
            </div>

            <div class="support-divider"></div>

            <div class="report-actions">

                <button
                    type="button"
                    class="report-action-button"
                    id="emailAction">
                    <span>✉️</span>
                    <div>
                        <strong>PAR E-MAIL</strong>
                        <small>Préparer le signalement par e-mail</small>
                    </div>
                    <b>→</b>
                </button>

                <button
                    type="button"
                    class="report-action-button"
                    id="officialChannel1">
                    <span>🌐</span>
                    <div>
                        <strong>CANAL OFFICIEL 1</strong>
                        <small>Canal 1</small>
                    </div>
                    <b>↗</b>
                </button>

                <button
                    type="button"
                    class="report-action-button"
                    id="officialChannel2">
                    <span>🌐</span>
                    <div>
                        <strong>CANAL OFFICIEL 2</strong>
                        <small>Canal 2</small>
                    </div>
                    <b>↗</b>
                </button>

                <button
                    type="button"
                    class="report-action-button"
                    id="whatsappContactAction">
                    <span>💬</span>
                    <div>
                        <strong>CONTACT WHATSAPP</strong>
                        <small>Depuis l'application WhatsApp</small>
                    </div>
                    <b>→</b>
                </button>

            </div>

        </div>
    `;

    document.getElementById("backToSupport").onclick =
        () => openSupport(currentType);

    document.getElementById("emailAction").onclick =
        openMail;

    document.getElementById("officialChannel1").onclick =
        () => {
            window.open(
                "https://www.whatsapp.com/contact/noclient?lang=fr_FR",
                "_blank"
            );
        };

    document.getElementById("officialChannel2").onclick =
        () => {
            window.open(
                "https://www.whatsapp.com/contact",
                "_blank"
            );
        };

    document.getElementById("whatsappContactAction").onclick =
        () => {

            reportBox.innerHTML = `
                <div class="support-screen">

                    <button
                        type="button"
                        id="backToActions"
                        class="back-category-button">
                        ← RETOUR
                    </button>

                    <div class="support-heading">
                        <span>💬</span>
                        <div>
                            <small>CONTACT WHATSAPP</small>
                            <h2>NOUS CONTACTER</h2>
                        </div>
                    </div>

                    <div class="support-divider"></div>

                    <div class="status">
                        <strong>COMMENT FAIRE</strong>
                    </div>

                    <div class="field-group" style="margin-top:16px;">
                        <textarea readonly>1. Copie le support avec le numéro pré-rempli.

2. Ouvre l'application WhatsApp.

3. Va dans :
Paramètres → Aide et commentaires → Nous contacter

4. Colle le support.

5. Vérifie les informations puis envoie le contact à WhatsApp.</textarea>
                    </div>

                </div>
            `;

            document.getElementById("backToActions").onclick =
                launchReport;
        };
}

function openMail(){

    if(!currentReport){

        showStatus(
            "❌ Prépare d'abord le signalement."
        );

        return;
    }


    const recipients =
        accountType === "business"
            ? BUSINESS_EMAILS
            : MESSENGER_EMAILS;


    const subject =
        accountType === "business"
            ? "Signalement WhatsApp Business"
            : "Signalement WhatsApp";


    const mailto =
        "mailto:" +
        recipients.join(",") +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(currentReport);


    showStatus(
        accountType === "business"
            ? "📧 E-mail Business préparé."
            : "📧 E-mail Messenger préparé."
    );


    window.location.href = mailto;
}


async function copyReport(){

    if(!currentReport){
        return false;
    }

    try{

        await navigator.clipboard.writeText(
            currentReport
        );

        return true;

    }catch(error){

        console.log(
            "Copie indisponible",
            error
        );

        return false;
    }
}


async function openWhatsAppContact(){

    if(!currentReport){

        showStatus(
            "❌ Prépare d'abord le signalement."
        );

        return;
    }


    const copied =
        await copyReport();


    if(copied){

        showStatus(
            "📋 Support copié. Le contact officiel WhatsApp va être ouvert. Colle ensuite le support et envoie-le manuellement."
        );

    }else{

        showStatus(
            "💬 Le contact officiel WhatsApp va être ouvert. Utilise le support affiché ci-dessus."
        );

    }


    setTimeout(() => {

        window.open(
            OFFICIAL_CONTACT,
            "_blank"
        );

    }, 300);
}


async function openOfficialChannel(){

    if(!currentReport){

        showStatus(
            "❌ Prépare d'abord le signalement."
        );

        return;
    }


    const copied =
        await copyReport();


    if(copied){

        showStatus(
            "📋 Support copié. Entre dans le canal officiel, clique sur « Nous contacter », colle le support puis envoie-le."
        );

    }else{

        showStatus(
            "🌐 Entre dans le canal officiel, clique sur « Nous contacter », puis utilise le support affiché ci-dessus."
        );

    }


    setTimeout(() => {

        window.open(
            OFFICIAL_CONTACT,
            "_blank"
        );

    }, 300);
}


async function saveLocalReport(
    target,
    type,
    description
){

    try{

        const body =
            new URLSearchParams();

        body.append(
            "target",
            target
        );

        body.append(
            "type",
            type
        );

        body.append(
            "description",
            description
        );


        await fetch(
            API + "/api/report",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body:
                    body.toString()
            }
        );


        loadHistory();

    }catch(error){

        console.log(
            "Historique local indisponible",
            error
        );

    }
}


async function loadHistory(){

    const history =
        document.getElementById("history");

    if(!history){
        return;
    }


    try{

        const response =
            await fetch(
                API + "/api/history"
            );

        const data =
            await response.json();


        if(
            !data.success ||
            !Array.isArray(data.items)
        ){

            history.innerHTML =
                "<p class='small'>Aucun historique.</p>";

            return;
        }


        if(data.items.length === 0){

            history.innerHTML =
                "<p class='small'>Aucun signalement enregistré.</p>";

            return;
        }


        history.innerHTML =
            data.items
                .slice()
                .reverse()
                .map(item => {

                    return `
                        <div class="history-item">

                            <strong>
                                ${escapeHTML(item.target)}
                            </strong>

                            <br>

                            <span class="badge">
                                ${escapeHTML(item.type)}
                            </span>

                            <div class="small">
                                ${escapeHTML(item.date || "")}
                            </div>

                            <div class="small">
                                Statut :
                                ${escapeHTML(
                                    item.status || "reçu"
                                )}
                            </div>

                        </div>
                    `;

                })
                .join("");


    }catch(error){

        history.innerHTML =
            "<p class='small'>API indisponible.</p>";

    }
}


/* =====================================================
   CATÉGORIES
   ===================================================== */

document.addEventListener(
    "click",
    function(event){

        const button =
            event.target.closest(
                ".report-type-btn[data-type]"
            );

        if(!button){
            return;
        }

        event.preventDefault();

        const type =
            button.getAttribute("data-type");

        if(type){
            openSupport(type);
        }

    }
);


/* =====================================================
   INITIALISATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        selectAccountType(
            accountType
        );

        loadHistory();

    }
);

