# AI Data Guardian
## Cahier des charges principal pour une réalisation full agentique

**Statut :** version de cadrage exécutable par agents de développement  
**Format cible :** Markdown, source de vérité du dépôt  
**Produit :** AI Data Guardian, plateforme de confiance pour la donnée et l'IA  
**Principe directeur :** démonstration exécutive convaincante, architecture simple, composants remplaçables, décisions traçables  

---

# 1. Executive Perspective

AI Data Guardian ne doit pas être présenté comme un nouvel outil de Data Governance. Le produit doit être compris comme une **AI Trust Platform** qui permet de déterminer rapidement si les données utilisées par un KPI, une décision, un rapport, un modèle ou un agent IA sont fiables, gouvernées, explicables et suffisamment prêtes pour l'usage envisagé.

Le démonstrateur doit rendre visible un cercle vertueux :

1. collecter les données, métadonnées, règles, politiques et signaux produits par les outils existants ;
2. analyser automatiquement les écarts de qualité, de gouvernance, de conformité et d'AI readiness ;
3. expliquer leurs conséquences métier ;
4. générer un plan de remédiation priorisé ;
5. faire valider ou corriger les conclusions par un expert ;
6. capitaliser ce retour pour améliorer les analyses suivantes.

La réussite du produit est mesurée d'abord par la compréhension et la réaction d'un décideur pendant une démonstration courte. La qualité technique reste nécessaire, mais elle sert une expérience produit simple, crédible et réutilisable.

## 1.1 Vision produit

> Transformer l'expertise du Data Office en une capacité IA réutilisable qui évalue la confiance, explique l'exposition métier et recommande les actions prioritaires pour rendre les données exploitables par l'analytics, la conformité et les agents IA.

## 1.2 Promesse en moins de 60 secondes

À partir d'un périmètre de données sélectionné, AI Data Guardian :

- affiche un **Trust Score** et un niveau d'**AI Readiness** ;
- explique pourquoi un KPI ou un cas d'usage ne peut pas être considéré comme fiable ;
- quantifie une exposition métier avec des hypothèses transparentes ;
- identifie les contrôles manquants et les risques réglementaires ;
- produit un plan de remédiation priorisé ;
- génère une synthèse prête pour un comité de direction ;
- conserve les validations et corrections des experts.

## 1.3 Décision recommandée

Construire un MVP orienté démonstration, fondé sur des fichiers et connecteurs simulés, avec une architecture modulaire permettant ensuite de remplacer progressivement les données synthétiques par des intégrations réelles.

---

# 2. Business Value

## 2.1 Problèmes métier traités

- Les outils de gouvernance et de qualité produisent des constats dispersés mais peu de conclusions exécutives.
- L'expertise est portée par un nombre limité d'experts et se réutilise difficilement.
- Les responsables métier ne voient pas clairement le lien entre défaut de donnée et décision opérationnelle.
- Les équipes IA ne disposent pas d'une preuve synthétique que les données sont adaptées à leur usage.
- Les plans de remédiation ne sont pas toujours priorisés selon la valeur, le risque et l'effort.
- Les décisions et corrections des Data Stewards ne sont pas capitalisées de manière structurée.

## 2.2 Utilisateurs cibles

### Utilisateurs principaux

- Executive Committee et Top Management
- Business Owners et responsables de KPI
- Data Owners
- Data Stewards
- Compliance Leaders
- responsables Data et AI Office

### Utilisateurs secondaires

- équipes Data Quality et Data Governance
- équipes Analytics, BI, Data Science et Agentic AI
- Risk Managers et auditeurs
- équipes de remédiation Data Engineering

## 2.3 Valeur générée

- augmentation de la couverture de gouvernance sans croissance proportionnelle des ressources ;
- réduction de l'effort manuel d'analyse et de synthèse ;
- amélioration de la confiance dans les décisions et produits IA ;
- accélération de la qualification des données pour les cas d'usage ;
- meilleure priorisation des investissements de remédiation ;
- capitalisation de l'expertise et des décisions ;
- production accélérée de rapports exécutifs et de preuves d'audit.

## 2.4 Effets Wow prioritaires

| Fonction | Impact métier | Wow effect | Complexité démo | Priorité |
|---|---|---|---|---|
| Explication de la non-fiabilité d'un KPI | High | High | Low | P0 |
| Trust Score explicable | High | High | Low | P0 |
| Plan de remédiation priorisé | High | High | Low | P0 |
| Synthèse exécutive automatique | High | High | Low | P0 |
| AI Readiness d'un dataset | High | High | Medium | P0 |
| Estimation de l'exposition financière | High | High | Medium | P1 |
| Détection de faiblesse réglementaire | High | High | Medium | P1 |
| Apprentissage à partir du feedback expert | High | High | Medium | P1 |
| Connexions natives multiples | Medium | Medium | High | P2 |
| Auto-remédiation en production | High | High | High | Hors MVP |

---

# 3. Périmètre produit

## 3.1 Dans le MVP

1. scénario métier configurable ;
2. import de fichiers CSV, XLSX, JSON, YAML, Markdown et PDF textuel si disponible ;
3. lecture du dossier `Manual_Inputs/` ;
4. inventaire des sources et classification de leur rôle ;
5. profilage de données tabulaires ;
6. ingestion de règles de qualité et politiques ;
7. détection d'anomalies et de contrôles manquants ;
8. Trust Score multidimensionnel ;
9. AI Readiness Score ;
10. analyse d'impact métier ;
11. recommandations et plan de remédiation ;
12. validation humaine ;
13. historique des décisions et preuves ;
14. dashboard exécutif ;
15. rapport exportable en Markdown, JSON et PDF si le composant d'export est activé ;
16. données synthétiques et mode démonstration ;
17. observabilité des agents et journal d'exécution.

## 3.2 Hors MVP

- connexion en écriture aux systèmes de production ;
- modification autonome de données client ;
- exécution irréversible sans approbation ;
- remplacement d'un catalogue, d'un outil DQ, MDM ou GRC existant ;
- entraînement ou fine-tuning sur données confidentielles ;
- moteur réglementaire juridiquement opposable ;
- calcul financier présenté comme une valeur comptable certaine ;
- orchestration distribuée à grande échelle.

## 3.3 Principe de réutilisation de `Manual_Inputs/`

Le contenu de `Manual_Inputs/` est une **source d'inspiration non autoritative**. L'ancien script peut être analysé, testé et réutilisé partiellement, mais ne doit jamais dicter l'architecture cible.

Règles obligatoires :

1. inventorier chaque fichier avant toute modification ;
2. identifier les fonctions, dépendances, entrées, sorties et hypothèses ;
3. classer chaque composant : `REUSE`, `ADAPT`, `REFERENCE_ONLY`, `REJECT` ;
4. produire `docs/legacy-assessment.md` ;
5. protéger le contenu original, aucun écrasement ;
6. encapsuler le code réutilisé derrière une interface ;
7. ajouter des tests avant intégration ;
8. documenter toute décision dans un ADR.

---

# 4. Parcours démonstrateur de référence

## 4.1 Executive story

Une entreprise souhaite déployer un agent IA pour assister le pilotage des ventes. Le KPI « Net Revenue » est utilisé par le comité de direction mais provient de plusieurs sources. AI Data Guardian découvre des doublons clients, une règle de fraîcheur manquante, un propriétaire non renseigné et une divergence entre définition métier et calcul technique.

En moins de 60 secondes, la plateforme :

1. affiche un Trust Score faible ;
2. relie les causes au KPI et au cas d'usage IA ;
3. explique l'exposition sur les décisions de prévision ;
4. propose trois actions prioritaires ;
5. simule l'amélioration du score après remédiation ;
6. génère une note exécutive.

## 4.2 Script de démonstration

1. Ouvrir le cockpit et choisir `Revenue Forecasting Agent`.
2. Montrer le Trust Score, l'AI Readiness et le statut `Not ready`.
3. Cliquer sur « Why not trusted? ».
4. Afficher trois causes avec preuves et données concernées.
5. Ouvrir l'impact métier et l'hypothèse d'exposition.
6. Ouvrir le plan de remédiation priorisé.
7. Accepter une recommandation comme Data Steward.
8. Afficher le score simulé après remédiation.
9. Générer l'Executive Brief.

## 4.3 Réaction attendue

> « Nous pensions voir un outil de contrôle de données. Nous voyons maintenant une capacité de confiance qui sécurise les décisions et les agents IA. »

---

# 5. Architecture fonctionnelle

## 5.1 Chaîne de valeur

```text
Sources et preuves
    -> Ingestion et catalogage
    -> Profilage et normalisation
    -> Evaluation des contrôles
    -> Analyse de confiance
    -> Analyse d'impact métier
    -> Recommandations et priorisation
    -> Validation humaine
    -> Reporting exécutif
    -> Mémoire et amélioration continue
```

## 5.2 Agents fonctionnels

### A01. Orchestrator Agent

- comprend l'objectif de l'analyse ;
- établit un plan ;
- sélectionne les agents utiles ;
- gère les dépendances, reprises et gates ;
- ne modifie aucune donnée métier ;
- consolide le résultat final.

### A02. Source Discovery Agent

- inventorie les fichiers et connecteurs ;
- détecte formats, schémas, tailles et relations probables ;
- identifie les sources non lisibles ou incomplètes ;
- produit un manifeste de sources.

### A03. Legacy Assessment Agent

- analyse `Manual_Inputs/` ;
- extrait les capacités de l'ancien code ;
- identifie risques et dépendances ;
- propose la matrice de réutilisation ;
- ne modifie rien sans gate.

### A04. Data Profiling Agent

- calcule complétude, unicité, validité, cohérence, fraîcheur disponible et distributions ;
- détecte valeurs aberrantes et duplications ;
- fournit les preuves statistiques reproductibles.

### A05. Metadata and Lineage Agent

- normalise les métadonnées ;
- mappe les champs proches avec score de confiance ;
- construit une lignée démonstrative entre source, dataset, KPI et cas d'usage ;
- exige validation pour les correspondances ambiguës.

### A06. Governance Evaluation Agent

- vérifie propriétaire, steward, définition, classification, règles, statut et preuves ;
- détecte les contrôles manquants ;
- compare les observations au framework chargé.

### A07. Compliance Agent

- associe politiques et exigences au périmètre ;
- identifie des signaux de faiblesse ;
- cite la règle ou le document à l'origine du signal ;
- ne produit pas d'avis juridique.

### A08. KPI Trust Agent

- relie les anomalies de données au KPI ;
- explique le niveau de confiance ;
- fournit une analyse causale traçable ;
- distingue fait, hypothèse et recommandation.

### A09. AI Readiness Agent

- évalue la pertinence des données pour un usage IA défini ;
- couvre qualité, contexte, gouvernance, sécurité, représentativité, droits et observabilité ;
- produit les blockers et conditions de Go.

### A10. Business Impact Agent

- traduit les anomalies en impacts opérationnels ;
- utilise uniquement des hypothèses explicites ;
- produit des scénarios bas, central, haut si des valeurs sont simulées ;
- interdit toute fausse précision.

### A11. Remediation Planner Agent

- transforme les constats en actions ;
- priorise selon impact, risque, effort et dépendances ;
- propose owner type, preuve attendue et résultat cible ;
- calcule un score après remédiation simulé.

### A12. Executive Storytelling Agent

- produit une synthèse compréhensible sans jargon ;
- structure : situation, risque, conséquence, décision, prochaines actions ;
- génère les messages de démonstration et le rapport.

### A13. Reviewer Agent

- vérifie cohérence, traçabilité, absence de faits inventés et conformité aux critères ;
- rejette les conclusions sans preuve ;
- produit un rapport de contrôle indépendant.

### A14. Feedback Learning Agent

- enregistre les corrections validées ;
- met à jour dictionnaires, préférences et exemples approuvés ;
- ne modifie pas les règles de scoring sans approbation versionnée.

## 5.3 Gates humains

- Gate G1 : validation du périmètre et des sources.
- Gate G2 : validation des mappings ambigus.
- Gate G3 : validation des hypothèses d'impact métier.
- Gate G4 : validation du plan de remédiation.
- Gate G5 : approbation du rapport exécutif.
- Gate G6 : autorisation de capitaliser un feedback comme règle réutilisable.

---

# 6. Modèle de confiance

## 6.1 Dimensions minimales

| Dimension | Description | Preuves attendues |
|---|---|---|
| Data Quality | complétude, validité, unicité, cohérence, fraîcheur | profils, règles, résultats |
| Governance | ownership, stewardship, définitions, statut | métadonnées, RACI, glossaire |
| Metadata | description, typage, sens métier | catalogue ou dictionnaire |
| Lineage | origine, transformations, usages | flux, mapping, liens KPI |
| Compliance | exigences applicables et preuves | politiques, contrôles, logs |
| Business Fitness | adéquation au besoin métier | SLA, seuils, usages |
| AI Readiness | adéquation au cas d'usage IA | droits, contexte, biais, monitoring |
| Evidence Strength | qualité, récence et traçabilité des preuves | source, date, méthode |

## 6.2 Règles du scoring

- Le score est configurable et versionné.
- Chaque dimension expose son poids, ses sous-scores et ses preuves.
- Un score ne peut être calculé si les données minimales requises sont absentes. Le résultat est alors `INSUFFICIENT_EVIDENCE`.
- Les règles déterministes priment sur le jugement d'un LLM.
- Le LLM peut expliquer et proposer, mais ne peut pas modifier silencieusement le calcul.
- Tout score doit comporter `score_version`, `calculation_timestamp`, `inputs`, `assumptions` et `evidence_ids`.
- La simulation après remédiation doit être clairement marquée `SIMULATED`.

## 6.3 Statuts

- `TRUSTED`
- `CONDITIONALLY_TRUSTED`
- `AT_RISK`
- `NOT_TRUSTED`
- `INSUFFICIENT_EVIDENCE`
- `REVIEW_REQUIRED`

---

# 7. Modèle de données conceptuel

## 7.1 Entités

- `Workspace`
- `Assessment`
- `BusinessUseCase`
- `DataSource`
- `Dataset`
- `DataField`
- `BusinessTerm`
- `KPI`
- `Policy`
- `Control`
- `DataQualityRule`
- `Finding`
- `Evidence`
- `Score`
- `ImpactScenario`
- `Recommendation`
- `RemediationAction`
- `Decision`
- `Feedback`
- `AgentRun`
- `Report`

## 7.2 Contrat minimal d'un Finding

```json
{
  "finding_id": "FND-001",
  "assessment_id": "ASM-001",
  "category": "DATA_QUALITY",
  "severity": "HIGH",
  "title": "Duplicate customer identifiers",
  "description": "...",
  "business_consequence": "...",
  "affected_assets": ["dataset:customers", "kpi:net_revenue"],
  "evidence_ids": ["EVD-001"],
  "confidence": 0.93,
  "status": "OPEN",
  "created_by": "agent:data-profiler",
  "requires_human_review": false
}
```

## 7.3 Contrat minimal d'une Evidence

```json
{
  "evidence_id": "EVD-001",
  "source_id": "SRC-001",
  "source_location": "demo_data/customers.csv",
  "method": "duplicate_key_check",
  "observed_value": 142,
  "unit": "rows",
  "is_synthetic": true,
  "hash": "sha256:...",
  "generated_at": "ISO-8601"
}
```

---

# 8. Exigences UX

## 8.1 Ecrans MVP

1. **Landing / Scenario Selector**
   - sélectionner un cas d'usage ;
   - démarrer une analyse ;
   - charger les données de démonstration.

2. **Executive Cockpit**
   - Trust Score ;
   - AI Readiness ;
   - statut ;
   - exposition métier ;
   - trois risques majeurs ;
   - trois actions prioritaires.

3. **Why Not Trusted**
   - cause ;
   - preuve ;
   - conséquence ;
   - niveau de confiance ;
   - possibilité de contester.

4. **Data and KPI Lineage**
   - représentation simplifiée des liens ;
   - sélection d'un noeud ;
   - affichage des findings associés.

5. **Remediation Plan**
   - actions triées ;
   - impact, effort, owner type, dépendances ;
   - score actuel et score simulé.

6. **Human Review Center**
   - décisions en attente ;
   - accepter, rejeter, corriger ;
   - justification obligatoire pour les corrections.

7. **Executive Report**
   - aperçu ;
   - export ;
   - sources et hypothèses ;
   - statut d'approbation.

8. **Agent Run Inspector**
   - timeline des agents ;
   - entrées et sorties ;
   - outils utilisés ;
   - erreurs et reprises ;
   - coûts et durée si disponibles.

## 8.2 Principes UX

- business consequence first ;
- un message clé par vue ;
- détails accessibles par drill-down ;
- faits, hypothèses et simulations visuellement distincts ;
- explications courtes par défaut ;
- chaque score ouvre sa méthode de calcul ;
- chaque recommandation ouvre ses preuves ;
- aucune action irréversible cachée ;
- mode démonstration compréhensible sans connexion externe.

---

# 9. User Stories de bout en bout

## Epic E01. Initialisation et découverte

### US-001. Créer une analyse

**En tant que** Business Owner  
**Je veux** créer une analyse associée à un cas d'usage métier  
**Afin de** déterminer si les données sont dignes de confiance pour cet usage.

**Critères d'acceptation**

- Given un workspace valide, When l'utilisateur crée une analyse, Then un identifiant, un statut et une version sont enregistrés.
- Given aucun cas d'usage, When l'utilisateur poursuit, Then le système exige au minimum un objectif, un KPI ou une décision cible.
- Given le mode démo, When l'analyse est créée, Then toutes les données synthétiques sont marquées comme telles.

### US-002. Inventorier `Manual_Inputs/`

**En tant que** Product Owner  
**Je veux** un inventaire automatique de l'ancien code  
**Afin de** identifier ce qui peut être réutilisé sans créer de dépendance cachée.

**Critères d'acceptation**

- Given le dossier existe, When l'agent de découverte s'exécute, Then il produit une liste des fichiers, langages, dépendances, entrées et sorties détectées.
- Given un fichier non lisible, When il est rencontré, Then il est signalé sans arrêter toute l'analyse.
- Given l'inventaire terminé, Then `docs/legacy-assessment.md` est généré.
- Given une proposition de réutilisation, Then chaque composant reçoit une classe et une justification.
- Given le contenu original, Then aucun fichier n'est modifié.

### US-003. Créer le manifeste des sources

- Given des fichiers supportés, When l'ingestion démarre, Then un manifeste versionné est créé.
- Each source includes path, type, hash, schema summary, synthetic flag and processing status.
- Duplicate files are detected by hash.

## Epic E02. Ingestion et profilage

### US-010. Importer des données tabulaires

- CSV, XLSX et JSON tabulaire sont supportés.
- Les erreurs de structure sont rapportées avec fichier, feuille, ligne ou champ si possible.
- Un aperçu limité est disponible sans exposer de valeur sensible non autorisée.
- Les traitements sont reproductibles à partir du manifeste.

### US-011. Profiler un dataset

- Le système calcule au minimum volume, nullité, cardinalité, duplications, types, distributions et violations de règles disponibles.
- Chaque métrique est attachée à une preuve.
- Les calculs numériques sont déterministes.
- Le LLM n'est pas utilisé pour calculer les métriques.

### US-012. Détecter une anomalie significative

- Un finding est créé seulement si une règle ou un seuil explicite est atteint.
- Le finding comporte une sévérité et un niveau de confiance.
- L'utilisateur peut voir l'échantillon ou l'agrégat ayant déclenché le finding.

## Epic E03. Métadonnées, mapping et lineage

### US-020. Mapper des colonnes hétérogènes

- L'agent combine correspondance exacte, similarité lexicale, type, échantillons et synonymes.
- Il propose plusieurs candidats pour les cas ambigus.
- Un mapping à faible confiance exige une validation humaine.
- Les décisions de mapping sont journalisées.

### US-021. Construire une lignée simplifiée

- L'utilisateur voit Source -> Dataset -> Transformation -> KPI -> Use Case.
- Chaque lien indique son origine : déclarée, détectée ou supposée.
- Un lien supposé ne peut pas être présenté comme un fait.

## Epic E04. Evaluation de gouvernance et conformité

### US-030. Evaluer la couverture de gouvernance

- Le système vérifie au minimum owner, steward, définition, classification, règles et statut.
- Les informations absentes créent des findings distincts.
- La méthode d'évaluation est configurable.

### US-031. Charger un framework ou une politique

- Le système ingère YAML, JSON ou Markdown structuré.
- Chaque contrôle possède un identifiant stable.
- Les findings de conformité citent le contrôle source.
- Le système affiche un avertissement indiquant qu'il ne fournit pas d'avis juridique.

## Epic E05. Trust Score et AI Readiness

### US-040. Calculer le Trust Score

- Le score expose les poids et sous-scores.
- Le résultat est reproductible sur les mêmes données et la même version.
- Les blockers sont visibles en premier.
- En cas de preuve insuffisante, le système ne remplace pas l'absence par une estimation arbitraire.

### US-041. Expliquer le score

- L'explication relie cause, preuve, actif et conséquence.
- Chaque affirmation factuelle dispose d'un `evidence_id`.
- Le texte distingue automatiquement fait, hypothèse et suggestion.

### US-042. Evaluer l'AI Readiness

- L'évaluation est spécifique au cas d'usage IA.
- Elle inclut qualité, droits, contexte, représentativité, sécurité et monitoring.
- Elle produit `READY`, `READY_WITH_CONDITIONS`, `NOT_READY` ou `INSUFFICIENT_EVIDENCE`.

## Epic E06. Impact métier

### US-050. Relier un problème de donnée à un KPI

- L'utilisateur peut sélectionner un KPI impacté.
- Le système explique le chemin causal.
- Un impact non prouvé est affiché comme hypothèse.

### US-051. Estimer l'exposition

- Les hypothèses sont visibles et modifiables.
- Les résultats simulés portent le label `SIMULATED`.
- Le système peut afficher des scénarios bas, central et haut.
- Le rapport ne transforme jamais la simulation en fait comptable.

## Epic E07. Remédiation

### US-060. Générer un plan d'actions

- Chaque action possède problème cible, owner type, effort, impact, dépendances, preuve de clôture et priorité.
- La priorité est calculée selon une formule versionnée.
- L'utilisateur peut modifier la priorité avec justification.

### US-061. Simuler l'amélioration

- Le score cible n'est recalculé que sur les règles couvertes par les actions simulées.
- La simulation conserve les hypothèses.
- L'utilisateur peut comparer avant/après.

## Epic E08. Validation humaine et apprentissage

### US-070. Valider un finding

- Accept, reject et correct sont disponibles.
- Reject et correct nécessitent un commentaire.
- L'identité, la date et la version sont tracées.

### US-071. Capitaliser un feedback

- Le feedback reste local à l'analyse tant qu'il n'est pas approuvé pour réutilisation.
- Une règle réutilisable est versionnée.
- Le système permet un rollback.
- L'auteur et l'approbateur sont tracés.

## Epic E09. Reporting exécutif

### US-080. Générer un Executive Brief

- Le rapport contient : contexte, statut, trois risques, impact, trois décisions et annexes de preuve.
- Le langage est compréhensible par un dirigeant.
- Les simulations et données synthétiques sont clairement indiquées.
- Le rapport conserve la version des scores et des sources.

## Epic E10. AgenticOps

### US-090. Tracer une exécution d'agents

- Chaque agent run possède un identifiant, un objectif, des entrées, sorties, outils, statut et timestamps.
- Les erreurs et reprises sont visibles.
- Les prompts et réponses sensibles peuvent être masqués selon configuration.

### US-091. Reprendre une exécution

- Une étape en échec peut être relancée sans recalcul complet si ses dépendances sont inchangées.
- Le système conserve l'historique des tentatives.
- Une reprise ne remplace pas les preuves précédentes.

## Epic E11. Sécurité et administration

### US-100. Protéger les secrets

- Aucun secret n'est stocké dans le dépôt.
- Les variables nécessaires sont documentées dans `.env.example` sans valeur réelle.
- Le démarrage échoue proprement si un secret requis manque.
- Les logs masquent tokens et clés.

### US-101. Prévenir les actions excessives

- Les agents utilisent le moindre privilège.
- Les accès en écriture externe sont désactivés dans le MVP.
- Les actions sensibles nécessitent approbation.
- Toutes les actions sont auditables.

---

# 10. Exigences non fonctionnelles

## 10.1 Sécurité

- secrets hors dépôt ;
- validation et nettoyage des entrées ;
- allowlist des extensions et outils ;
- prévention du path traversal ;
- journalisation des actions ;
- RBAC minimal si authentification activée ;
- séparation données démo et données réelles ;
- analyse des dépendances ;
- protection contre prompt injection indirecte issue des documents ;
- aucune instruction contenue dans une source de données ne doit surcharger les règles système.

## 10.2 Privacy et conformité

- minimisation des données ;
- anonymisation ou pseudonymisation avant démonstration ;
- marquage des données personnelles détectées ;
- durée de rétention configurable ;
- suppression logique du workspace ;
- contrôle humain des sorties ;
- politiques et modèles autorisés uniquement ;
- absence de fine-tuning dans le MVP.

## 10.3 Qualité et testabilité

- fonctions de calcul déterministes ;
- tests unitaires sur scoring, profilage et priorisation ;
- tests de contrat pour JSON ;
- tests d'intégration de chaque pipeline ;
- tests E2E du scénario démo ;
- golden files pour rapports ;
- tests de non-régression sur `Manual_Inputs/` si réutilisé ;
- aucun mock silencieux : les données synthétiques sont déclarées.

## 10.4 Performance MVP

Objectifs proposés à confirmer après premier prototype :

- démarrage local simple ;
- analyse d'un scénario démo sans infrastructure distribuée ;
- interface réactive pour des datasets de démonstration ;
- possibilité de mettre en cache les résultats déterministes ;
- timeouts et retries bornés pour les appels LLM.

## 10.5 Observabilité

- logs structurés ;
- correlation ID ;
- traces d'agents ;
- métriques de succès, erreur et retry ;
- consommation LLM si fournie par le provider ;
- version des prompts ;
- version des règles et données ;
- état de chaque gate.

## 10.6 Accessibilité et internationalisation

- langue d'interface configurable, français et anglais au minimum ;
- contrastes et navigation clavier ;
- textes alternatifs pour exports ;
- formats de nombres et dates localisables ;
- aucun sens porté uniquement par la couleur.

---

# 11. Architecture technique recommandée

## 11.1 Choix MVP

- **Backend :** Python 3.12, FastAPI.
- **Frontend :** Streamlit pour vitesse de démonstration, ou React si une expérience plus premium est prioritaire. Décision par ADR.
- **Orchestration :** graphe d'état explicite. LangGraph est optionnel, une machine à états interne suffit au départ.
- **Data processing :** pandas, openpyxl, pyarrow selon besoin.
- **Validation :** Pydantic v2.
- **Stockage :** SQLite pour le MVP, abstraction repository obligatoire.
- **Fichiers :** stockage local du workspace en mode démo, interface compatible objet pour future cible cloud.
- **LLM :** adaptateur OpenAI-compatible, fournisseur interchangeable.
- **Embeddings :** optionnels ; désactivables ; fallback lexical obligatoire.
- **Tests :** pytest, Playwright pour E2E si frontend web.
- **Packaging :** Docker et Docker Compose.

## 11.2 Répartition déterministe / générative

### Déterministe

- parsing ;
- profilage ;
- calcul des métriques ;
- scoring ;
- règles de priorité ;
- gestion d'état ;
- validation de schéma ;
- génération des identifiants et preuves.

### Génératif

- explication métier ;
- mapping sémantique assisté ;
- synthèse des politiques ;
- hypothèses proposées ;
- recommandations ;
- narrative exécutive.

### Règle

Aucun contenu génératif ne devient un fait sans preuve ou validation.

## 11.3 Structure de dépôt cible

```text
AI-Data-Guardian/
├── AGENTS.md
├── README.md
├── pyproject.toml
├── docker-compose.yml
├── .env.example
├── .github/
│   ├── copilot-instructions.md
│   ├── agents/
│   │   ├── product-owner.agent.md
│   │   ├── architect.agent.md
│   │   ├── developer.agent.md
│   │   ├── reviewer.agent.md
│   │   └── demo-designer.agent.md
│   ├── instructions/
│   │   ├── python.instructions.md
│   │   ├── markdown.instructions.md
│   │   └── tests.instructions.md
│   ├── prompts/
│   │   ├── plan-story.prompt.md
│   │   ├── implement-story.prompt.md
│   │   ├── review-story.prompt.md
│   │   └── prepare-demo.prompt.md
│   └── skills/
│       ├── legacy-assessment/SKILL.md
│       ├── create-user-story/SKILL.md
│       └── executive-brief/SKILL.md
├── .agents/
│   ├── PROJECT.md
│   ├── REQUIREMENTS.md
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   ├── STATE.md
│   ├── DECISIONS.md
│   ├── security-guardrails.md
│   └── stories/
├── Manual_Inputs/
├── demo_data/
├── config/
│   ├── scoring.yaml
│   ├── policies/
│   ├── scenarios/
│   └── prompts/
├── src/ai_data_guardian/
│   ├── api/
│   ├── app/
│   ├── agents/
│   ├── orchestration/
│   ├── domain/
│   ├── ingestion/
│   ├── profiling/
│   ├── scoring/
│   ├── governance/
│   ├── compliance/
│   ├── impact/
│   ├── remediation/
│   ├── reporting/
│   ├── memory/
│   ├── providers/
│   └── observability/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── security/
│   └── fixtures/
├── docs/
│   ├── product/
│   ├── architecture/
│   ├── adr/
│   ├── demo/
│   ├── legacy-assessment.md
│   └── glossary.md
└── outputs/
    ├── reports/
    └── run_logs/
```

---

# 12. Contrat d'exécution full agentique

## 12.1 Source de vérité

Ordre de priorité :

1. `CAHIER_DES_CHARGES_AI_DATA_GUARDIAN.md` ;
2. `.agents/REQUIREMENTS.md` ;
3. `.agents/ARCHITECTURE.md` et ADR approuvés ;
4. story atomique active ;
5. code et tests existants ;
6. contenu de `Manual_Inputs/` uniquement comme référence.

En cas de conflit, l'agent doit s'arrêter et produire une demande de décision. Il ne doit pas choisir silencieusement.

## 12.2 Cycle d'une story

1. **Discover** : lire la story, les dépendances et fichiers concernés.
2. **Plan** : produire un micro-plan et les risques.
3. **Test First** : ajouter ou mettre à jour les tests.
4. **Implement** : modifier le périmètre minimal.
5. **Verify** : lancer tests, lint, type-check et contrôles sécurité.
6. **Review** : revue indépendante contre les critères.
7. **Unify** : mettre à jour documentation, décisions et état.
8. **Stop** : ne pas enchaîner automatiquement sur une story non dépendante sans instruction.

## 12.3 Définition Ready d'une story

- objectif métier clair ;
- persona et valeur ;
- critères Given/When/Then ;
- périmètre et hors périmètre ;
- dépendances ;
- contrats d'entrée/sortie ;
- cas d'erreur ;
- exigences sécurité ;
- données de test ;
- preuve de démonstration attendue.

## 12.4 Définition Done

- critères d'acceptation vérifiés ;
- tests réussis ;
- aucune régression connue ;
- aucune vulnérabilité critique connue ;
- logs et erreurs exploitables ;
- documentation mise à jour ;
- ADR créé si décision structurante ;
- scénario de démonstration vérifié ;
- reviewer agent donne `APPROVED` ou les écarts sont résolus ;
- humain approuve les gates requis.

## 12.5 Interdictions agents

- inventer une API, une politique ou une capacité non présente ;
- inclure des secrets ;
- supprimer ou réécrire `Manual_Inputs/` ;
- modifier le scoring sans changement de version ;
- contourner un test au lieu de corriger la cause ;
- désactiver un contrôle sécurité pour faire passer le build ;
- présenter une simulation comme un fait ;
- effectuer une écriture externe en MVP ;
- fusionner une modification sans revue indépendante.

---

# 13. API fonctionnelle minimale

```text
POST   /assessments
GET    /assessments/{id}
POST   /assessments/{id}/sources
POST   /assessments/{id}/run
GET    /assessments/{id}/runs
GET    /assessments/{id}/findings
GET    /assessments/{id}/scores
GET    /assessments/{id}/lineage
POST   /findings/{id}/decisions
GET    /assessments/{id}/recommendations
POST   /recommendations/{id}/simulate
POST   /feedback
POST   /assessments/{id}/reports
GET    /reports/{id}
GET    /health
```

Chaque endpoint doit avoir un schéma d'entrée, un schéma de sortie, des erreurs documentées et un correlation ID.

---

# 14. Données de démonstration

## 14.1 Jeux requis

- clients avec doublons et champs manquants ;
- transactions avec fraîcheur insuffisante ;
- catalogue partiel ;
- définition métier du KPI ;
- mapping technique divergent ;
- politique Data Quality ;
- règles de gouvernance ;
- description du cas d'usage IA ;
- feedback historique synthétique.

## 14.2 Règles

- aucune donnée réelle identifiable ;
- chaque anomalie est intentionnelle et documentée ;
- un fichier `demo_data/README.md` décrit le scénario ;
- les résultats attendus sont définis dans des fixtures golden ;
- au moins un scénario `trusted` et un scénario `not trusted`.

---

# 15. Backlog priorisé

## Phase 0. Foundation

- F0-01 initialiser la structure du dépôt ;
- F0-02 créer les instructions agents ;
- F0-03 créer les modèles de domaine ;
- F0-04 créer la configuration de scoring ;
- F0-05 construire le scénario synthétique ;
- F0-06 analyser `Manual_Inputs/` ;
- F0-07 mettre en place tests, lint et sécurité.

## Phase 1. Trusted Data Assessment

- ingestion ;
- profilage ;
- findings et preuves ;
- Trust Score ;
- cockpit minimal ;
- explication « Why not trusted? ».

## Phase 2. AI Trust and Remediation

- AI Readiness ;
- lineage ;
- impact métier ;
- remédiation ;
- simulation avant/après ;
- review center.

## Phase 3. Executive Demonstrator

- storytelling ;
- export de rapport ;
- scénario guidé ;
- logs d'agents ;
- polish UX ;
- tests E2E.

## Phase 4. Productization Option

- adaptateurs cloud ;
- multi-tenant ;
- identité et RBAC ;
- connecteurs réels ;
- billing/metering ;
- hardening et marketplace packaging.

---

# 16. KPI de succès du MVP

## Produit

- le scénario principal est compris sans explication technique ;
- le décideur identifie immédiatement le risque et la décision attendue ;
- chaque conclusion critique dispose d'une preuve accessible ;
- le rapport est généré à partir du même état que le dashboard.

## Fonctionnel

- le pipeline complet fonctionne sur les données de démonstration ;
- les scores sont reproductibles ;
- les feedbacks sont historisés ;
- le legacy assessment est produit sans modification de l'ancien code.

## Agentique

- chaque agent a une mission bornée ;
- l'orchestrateur produit un plan et conserve l'état ;
- les reprises sont possibles ;
- les outputs sont structurés et validés ;
- les gates sont respectés ;
- la revue finale est indépendante de l'agent ayant implémenté.

---

# 17. Risques et simplifications

| Risque | Conséquence | Simplification / mitigation |
|---|---|---|
| Périmètre trop large | démonstrateur incomplet | un scénario, quelques sources, effets Wow P0 |
| Trop d'agents | orchestration fragile | agents logiques, exécution possible dans un seul processus |
| Scoring contestable | perte de confiance | formule visible, versionnée, configurable |
| Impact financier artificiel | crédibilité réduite | hypothèses visibles et scénarios simulés |
| Ancien code survalorisé | dette héritée | assessment avant réutilisation |
| LLM utilisé pour les calculs | non-reproductibilité | calculs déterministes |
| Prompt injection documentaire | comportement détourné | sources traitées comme données, jamais comme instructions |
| Données sensibles | risque privacy | données synthétiques par défaut |
| Framework agentique trop complexe | délai et lock-in | machine à états simple et adaptateurs |
| UX trop technique | faible impact exécutif | business consequence first |

---

# 18. Décisions ouvertes à formaliser par ADR

- ADR-001 : Streamlit ou React pour l'interface MVP.
- ADR-002 : orchestration interne ou LangGraph.
- ADR-003 : SQLite seule ou SQLite plus stockage objet local.
- ADR-004 : provider LLM de démonstration.
- ADR-005 : formule initiale du Trust Score.
- ADR-006 : approche PDF et présentation exécutive.
- ADR-007 : stratégie d'authentification du MVP.
- ADR-008 : composants de `Manual_Inputs/` réutilisés.

---

# 19. Next Best Action pour l'agent dans VS Code

L'agent qui reçoit ce document doit commencer par les actions suivantes, dans cet ordre :

1. analyser le dépôt sans modifier de fichiers ;
2. inventorier `Manual_Inputs/` ;
3. comparer l'état du repo à la structure cible ;
4. produire `.agents/PROJECT.md`, `.agents/REQUIREMENTS.md`, `.agents/ARCHITECTURE.md`, `.agents/ROADMAP.md` et `.agents/STATE.md` ;
5. produire `docs/legacy-assessment.md` ;
6. proposer les ADR initiaux ;
7. découper Phase 0 en stories atomiques ;
8. présenter le plan et attendre le Gate G1 avant implémentation.

## Prompt de démarrage recommandé

```text
Tu es l'orchestrateur de réalisation d'AI Data Guardian.
Lis intégralement CAHIER_DES_CHARGES_AI_DATA_GUARDIAN.md.
Analyse le dépôt en lecture seule, y compris Manual_Inputs/.
Ne modifie aucun fichier existant dans Manual_Inputs/.
Produis d'abord :
1. l'état des lieux du repo,
2. la matrice REUSE / ADAPT / REFERENCE_ONLY / REJECT,
3. les écarts par rapport au cahier des charges,
4. l'architecture MVP proposée,
5. les ADR à décider,
6. le backlog Phase 0 avec critères Given/When/Then,
7. les risques et simplifications.
Distingue faits observés, hypothèses et recommandations.
N'invente aucune capacité non vérifiée.
Arrête-toi avant toute implémentation et demande le Gate G1.
```

---

# 20. Règle finale

AI Data Guardian doit toujours répondre à trois questions dans cet ordre :

1. **Puis-je faire confiance à ces données pour cet usage ?**
2. **Quel est le risque métier si je les utilise malgré les écarts ?**
3. **Quelles actions offrent le meilleur gain de confiance au moindre effort ?**

Toute fonctionnalité qui ne renforce pas directement l'une de ces trois réponses doit être challengée, simplifiée ou différée.
