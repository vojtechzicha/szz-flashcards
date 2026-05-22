const FLASHCARD_DATA = {
  subjects: [
    { id: 's1', name: 'Podniková ekonomika I.', questionIds: ['q1','q2'] },
    { id: 's2', name: 'Podniková ekonomika II.', questionIds: ['q3','q4'] },
    { id: 's3', name: 'Účetnictví pro manažery', questionIds: ['q5','q6'] },
    { id: 's4', name: 'Finanční řízení podniku', questionIds: ['q7'] },
    { id: 's5', name: 'Obchodní právo', questionIds: ['q8','q9','q10'] },
    { id: 's6', name: 'Politické a kulturní aspekty globálního podnikání', questionIds: ['q11','q12','q13','q14'] },
    { id: 's7', name: 'Krizový management', questionIds: ['q15'] },
    { id: 's8', name: 'Projektový management', questionIds: ['q16','q17','q18','q19'] },
    { id: 's9', name: 'Společenská odpovědnost firem', questionIds: ['q20'] }
  ],

  questions: [
    { id: 'q1', title: '1. Výrobní činnost podniku', subtitle: 'Výrobní proces, druhy výrob, výrobní kapacita' },
    { id: 'q2', title: '2. Náklady podniku', subtitle: 'Charakteristika nákladů, nákladové funkce, bod zvratu' },
    { id: 'q3', title: '3. Kalkulace a kalkulační metody', subtitle: 'Kalkulační systém, struktura nákladů, ABC' },
    { id: 'q4', title: '4. Cenová tvorba', subtitle: 'Definice ceny, cenová politika, metody stanovení ceny' },
    { id: 'q5', title: '5. Finanční účetnictví', subtitle: 'Podstata, právní úprava, principy účetnictví' },
    { id: 'q6', title: '6. Účetní výkazy', subtitle: 'Rozvaha, VZZ, cash flow' },
    { id: 'q7', title: '7. Finanční analýza', subtitle: 'Poměrové ukazatele, měření výkonnosti' },
    { id: 'q8', title: '8. Osobní obchodní společnosti', subtitle: 'V.o.s., k.s., družstvo' },
    { id: 'q9', title: '9. Kapitálové obchodní společnosti', subtitle: 'S.r.o., a.s.' },
    { id: 'q10', title: '10. Závazky v obchodních vztazích', subtitle: 'Závazek vs. smlouva, zajištění' },
    { id: 'q11', title: '11. Globalizace', subtitle: 'Definice, historie, BRICS vs G7' },
    { id: 'q12', title: '12. Evropská unie', subtitle: 'Historie, orgány EU, členství ČR' },
    { id: 'q13', title: '13. Mezinárodní ekonomické instituce', subtitle: 'IMF, WB, WTO, APEC, NAFTA, MERCOSUR, ASEAN' },
    { id: 'q14', title: '14. Světová hospodářská krize', subtitle: 'Ekonomické teorie, historické krize, 2008' },
    { id: 'q15', title: '15. Krizový management', subtitle: 'Fáze krize, proces řešení, nástroje' },
    { id: 'q16', title: '16. Projektové řízení', subtitle: 'Projekt, životní cyklus, metody hodnocení' },
    { id: 'q17', title: '17. Projektové řízení zdrojů', subtitle: 'Čas, náklady, rizika, kvalita' },
    { id: 'q18', title: '18. Projektový tým', subtitle: 'Belbin, Tuckman, organizační struktury' },
    { id: 'q19', title: '19. Studie proveditelnosti', subtitle: 'Struktura, analytické a finanční nástroje' },
    { id: 'q20', title: '20. Etické nástroje managementu', subtitle: 'CSR, ESG, ISO, GRI, Fair Trade' }
  ],

  cards: [
    // ===== Q1 - Výrobní činnost podniku =====
    {
      id: 'c1', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Co je výrobní proces?',
      back: '<strong>Výrobní proces</strong> = přeměna výrobních faktorů (vstupů) na výrobky a služby (výstupy).'
    },
    {
      id: 'c2', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Jaké jsou 3 stupně mechanizace výroby?',
      back: '<ul><li><strong>Ruční</strong> – převažuje lidská práce</li><li><strong>Mechanizovaná</strong> – stroje řízené člověkem</li><li><strong>Automatizovaná</strong> – stroje řízené automaticky</li></ul>'
    },
    {
      id: 'c3', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Jaké jsou 3 druhy výroby dle objemu?',
      back: '<ul><li><strong>Zakázková (kusová)</strong> – jednotlivé kusy na zakázku</li><li><strong>Sériová</strong> – opakující se série výrobků</li><li><strong>Hromadná (masová)</strong> – velký objem stejných výrobků</li></ul>'
    },
    {
      id: 'c4', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Jak se vypočítá efektivní časový fond F<sub>e</sub>?',
      back: '<div class="math-block">F<sub>e</sub>[h] = (F<sub>k</sub> - F<sub>v</sub> - t<sub>z</sub>) &middot; s &middot; h</div><ul><li><span class="var">F<sub>k</sub></span> = kalendářní dny</li><li><span class="var">F<sub>v</sub></span> = volné dny (víkendy, svátky)</li><li><span class="var">t<sub>z</sub></span> = ztráty (opravy, údržba)</li><li><span class="var">s</span> = počet směn</li><li><span class="var">h</span> = hodin za směnu</li></ul>'
    },
    {
      id: 'c5', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Jak se vypočítá celková pracnost P<sub>k</sub>?',
      back: '<div class="math-block">P<sub>k</sub> = &Sigma;(Q<sub>i</sub> &middot; pk<sub>i</sub>)</div><ul><li><span class="var">Q<sub>i</sub></span> = objem výroby i-tého výrobku</li><li><span class="var">pk<sub>i</sub></span> = pracnost jednoho kusu i-tého výrobku</li></ul>'
    },
    {
      id: 'c6', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Jak se vypočítá potřebný počet výrobních zařízení <span class="var">a</span>?',
      back: '<div class="math-block"><span class="var">a</span> = <span class="frac"><span class="frac-num">P<sub>k</sub></span><span class="frac-den">F<sub>e</sub></span></span></div><p>Výsledek se <strong>zaokrouhluje nahoru</strong> (nelze mít zlomek stroje).</p>'
    },
    {
      id: 'c7', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Co je koeficient zatížení k<sub>z</sub> a jak se vypočítá?',
      back: '<div class="math-block">k<sub>z</sub> = <span class="frac"><span class="frac-num">P<sub>k</sub></span><span class="frac-den">F<sub>e</sub> &middot; a&deg;</span></span></div><p><span class="var">a&deg;</span> = skutečný (zaokrouhlený nahoru) počet zařízení. Ukazuje <strong>míru využití kapacity</strong> (ideálně blízko 1).</p>'
    },
    {
      id: 'c8', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Jaký je vzorec pro výrobní kapacitu plochy V<sub>k</sub>?',
      back: '<div class="math-block">V<sub>k</sub> = P &times; v &times; č</div><ul><li><span class="var">P</span> = plocha</li><li><span class="var">v</span> = výkon na jednotku plochy</li><li><span class="var">č</span> = čas (využitelný fond)</li></ul>'
    },
    {
      id: 'c9', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Jak se vypočítá Q<sub>M</sub> – maximální počet výrobků z plochy?',
      back: '<div class="math-block">Q<sub>M</sub>[ks] = <span class="frac"><span class="frac-num">M &middot; F<sub>e</sub></span><span class="frac-den">m &middot; pk<sub>i</sub></span></span></div><p>kde <span class="var">M</span> = CP - PP (čistá plocha = celková - pomocná plocha), <span class="var">m</span> = plocha na 1 výrobek.</p>'
    },
    {
      id: 'c10', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Co je čistá výrobní plocha M?',
      back: '<div class="math-block">M = CP - PP</div><ul><li><span class="var">CP</span> = celková plocha</li><li><span class="var">PP</span> = pomocná plocha (chodby, sklady apod.)</li></ul><p>Čistá plocha se používá přímo pro výrobu.</p>'
    },
    {
      id: 'c11', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Co se rozumí pod pojmem „výrobní kapacita"?',
      back: '<strong>Výrobní kapacita</strong> = maximální objem produkce, který může výrobní jednotka vyrobit za danou dobu při plném využití výrobních zařízení a plochy.'
    },
    {
      id: 'c12', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Co jsou výrobní faktory?',
      back: 'Vstupy do výrobního procesu:<ul><li><strong>Práce</strong> (lidský faktor)</li><li><strong>Půda</strong> (přírodní zdroje)</li><li><strong>Kapitál</strong> (stroje, budovy, finance)</li></ul>'
    },
    {
      id: 'c13', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Co jsou kalendářní dny F<sub>k</sub> a volné dny F<sub>v</sub> ve vzorci F<sub>e</sub>?',
      back: '<ul><li><span class="var">F<sub>k</sub></span> = celkový počet dnů v období (365 za rok)</li><li><span class="var">F<sub>v</sub></span> = nepracovní dny – víkendy, svátky</li></ul><p>Po jejich odečtení a odečtení ztrát t<sub>z</sub> získáme <strong>efektivní dny</strong> pro výrobu.</p>'
    },
    {
      id: 'c14', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Jaký je rozdíl mezi zakázkovou a hromadnou výrobou?',
      back: '<ul><li><strong>Zakázková (kusová):</strong> malé množství, individuální výrobky, vysoké náklady na kus, flexibilní</li><li><strong>Hromadná (masová):</strong> velký objem stejných výrobků, nízké náklady na kus, specializované stroje, standardizace</li></ul>'
    },
    {
      id: 'c15', questionId: 'q1',
      front: '<span class="tag">Výrobní činnost</span> Co je pracnost pk<sub>i</sub>?',
      back: '<strong>Pracnost</strong> pk<sub>i</sub> = čas (v hodinách) potřebný k výrobě jednoho kusu i-tého výrobku. Vstupuje do výpočtu celkové pracnosti P<sub>k</sub> a kapacitních propočtů.'
    },

    // ===== Q2 - Náklady podniku =====
    {
      id: 'c16', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Jak se vypočítá hospodářský výsledek (HV)?',
      back: '<div class="math-block">HV = V - N</div><ul><li><span class="var">V</span> = výnosy</li><li><span class="var">N</span> = náklady</li></ul><p>HV &gt; 0 → <strong>zisk</strong>, HV &lt; 0 → <strong>ztráta</strong>.</p>'
    },
    {
      id: 'c17', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Co jsou tržby?',
      back: '<strong>Tržby</strong> = peněžní částky získané prodejem výrobků a služeb. Jsou <strong>součástí výnosů</strong> (výnosy zahrnují i další položky – úroky, dotace aj.).'
    },
    {
      id: 'c18', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Jaká jsou 4 hlavní členění nákladů?',
      back: '<ul><li><strong>Druhové</strong> – materiál, mzdy, odpisy, služby</li><li><strong>Účelové</strong> – na co byly vynaloženy</li><li><strong>Kalkulační</strong> – přímé a nepřímé</li><li><strong>Dle objemu produkce</strong> – fixní a variabilní</li></ul>'
    },
    {
      id: 'c19', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Co jsou fixní náklady? Uveďte příklady.',
      back: '<strong>Fixní náklady (FN)</strong> = nemění se s objemem výroby, platí se vždy.<br>Příklady:<ul><li>Nájem</li><li>Odpisy</li><li>Splátky úvěrů</li><li>Mzdy (THP)</li><li>Energie (paušální část)</li></ul>'
    },
    {
      id: 'c20', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Co jsou variabilní náklady? Uveďte příklady.',
      back: '<strong>Variabilní náklady (VN)</strong> = mění se s objemem výroby.<br>Příklady:<ul><li>Přímý materiál</li><li>Přímé mzdy (úkolové)</li><li>Spotřeba energií na výrobu</li></ul><div class="math-block">VN = v &middot; Q</div>'
    },
    {
      id: 'c21', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Jaký je vzorec nákladové funkce?',
      back: '<div class="math-block">N = FN + v &middot; Q</div><ul><li><span class="var">FN</span> = fixní náklady</li><li><span class="var">v</span> = variabilní náklady na jednotku</li><li><span class="var">Q</span> = objem produkce</li></ul>'
    },
    {
      id: 'c22', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Jaký je rozdíl mezi homogenní a nehomogenní produkcí v nákladové funkci?',
      back: '<ul><li><strong>Homogenní:</strong> <span class="var">v</span> [Kč/ks], <span class="var">Q</span> [ks] – jeden druh výrobku</li><li><strong>Nehomogenní:</strong> <span class="var">v*</span> [Kč], <span class="var">Q</span> [Kč] (tržby) – více druhů výrobků, v* je bezrozměrný koeficient</li></ul>'
    },
    {
      id: 'c23', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Jak funguje metoda dvou období pro stanovení nákladové funkce?',
      back: 'Z 12 měsíců vybereme <strong>měsíc s minimální</strong> a <strong>maximální</strong> produkcí. Ze dvou bodů (Q<sub>min</sub>, N<sub>min</sub>) a (Q<sub>max</sub>, N<sub>max</sub>) spočítáme:<div class="math-block">v = <span class="frac"><span class="frac-num">N<sub>max</sub> - N<sub>min</sub></span><span class="frac-den">Q<sub>max</sub> - Q<sub>min</sub></span></span></div><div class="math-block">FN = N<sub>max</sub> - v &middot; Q<sub>max</sub></div>'
    },
    {
      id: 'c24', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Jak funguje metoda průměrů pro stanovení nákladové funkce?',
      back: '<ol><li>Seřadíme 12 měsíců dle objemu Q</li><li>Rozdělíme na <strong>2 poloviny</strong> (po 6)</li><li>Spočítáme průměry Q a N pro obě poloviny</li><li>Z dvou průměrných bodů vypočítáme v a FN</li></ol><p>Je <strong>přesnější</strong> než metoda dvou období, protože využívá všechna data.</p>'
    },
    {
      id: 'c25', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Jak se vypočítá bod zvratu (BEP)?',
      back: '<div class="math-block">BEP = <span class="frac"><span class="frac-num">FN</span><span class="frac-den">p - vn</span></span></div><ul><li><span class="var">FN</span> = fixní náklady</li><li><span class="var">p</span> = cena za jednotku</li><li><span class="var">vn</span> = variabilní náklady na jednotku</li></ul><p>BEP = objem produkce, při kterém jsou <strong>tržby = náklady</strong> (zisk = 0).</p>'
    },
    {
      id: 'c26', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Co je bod zvratu (BEP) a co znamená?',
      back: '<strong>Bod zvratu (Break-Even Point)</strong> = objem produkce, při němž se celkové tržby rovnají celkovým nákladům.<ul><li>Pod BEP → <strong>ztráta</strong></li><li>Nad BEP → <strong>zisk</strong></li></ul>'
    },
    {
      id: 'c27', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Jaký je rozdíl mezi příjmem a výnosem?',
      back: '<ul><li><strong>Výnos</strong> = vystavení faktury (pohledávka) – účetní kategorie</li><li><strong>Příjem</strong> = proplacení faktury (přírůstek na bankovním účtu) – peněžní kategorie</li></ul><p>Výnos ≠ příjem – liší se <strong>časově</strong>.</p>'
    },
    {
      id: 'c28', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Jaký je rozdíl mezi výdajem a nákladem?',
      back: '<ul><li><strong>Náklad</strong> = spotřeba vstupů v účetním období (účetní kategorie)</li><li><strong>Výdaj</strong> = úbytek peněz (peněžní kategorie)</li></ul><p>Příklad: nákup stroje je <strong>výdaj</strong>, odpis stroje je <strong>náklad</strong>.</p>'
    },
    {
      id: 'c29', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Co je příspěvek na úhradu (krycí příspěvek)?',
      back: '<div class="math-block">p - vn</div><p>Rozdíl mezi cenou a variabilními náklady na jednotku. Slouží k úhradě fixních nákladů a tvorby zisku. Nachází se ve <strong>jmenovateli BEP</strong>.</p>'
    },
    {
      id: 'c30', questionId: 'q2',
      front: '<span class="tag">Náklady</span> Jaké jsou celkové náklady N?',
      back: '<div class="math-block">N = FN + VN</div><p>Celkové náklady = fixní náklady + variabilní náklady. Variabilní náklady závisí na objemu: VN = v &middot; Q.</p>'
    },

    // ===== Q3 - Kalkulace a kalkulační metody =====
    {
      id: 'c31', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Jaké jsou hlavní položky přímých nákladů?',
      back: '<ul><li><strong>PM</strong> – přímý materiál</li><li><strong>PMZ</strong> – přímé mzdy</li><li><strong>OPN</strong> – ostatní přímé náklady</li></ul><p>Přímé náklady lze přímo přiřadit ke konkrétnímu výrobku.</p>'
    },
    {
      id: 'c32', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Jaké jsou druhy režijních (nepřímých) nákladů?',
      back: '<ul><li><strong>VR</strong> – výrobní režie</li><li><strong>SR</strong> – správní režie</li><li><strong>ZR</strong> – zásobovací režie</li><li><strong>OR</strong> – odbytová režie</li></ul><p>Nelze je přímo přiřadit jednomu výrobku – rozvrhují se.</p>'
    },
    {
      id: 'c33', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Jak se sestaví kalkulační vzorec – od přímých nákladů po úplné vlastní náklady?',
      back: '<ol><li><strong>PM + PMZ + OPN</strong> = přímé náklady</li><li>+ <strong>VR</strong> = <strong>vlastní náklady výroby</strong></li><li>+ <strong>SR</strong> = <strong>vlastní náklady výkonu</strong></li><li>+ <strong>ZR + OR</strong> = <strong>úplné vlastní náklady výkonu (nj)</strong></li></ol>'
    },
    {
      id: 'c34', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Jaké typy kalkulací tvoří kalkulační systém?',
      back: '<strong>Předběžné kalkulace:</strong><ul><li><strong>Propočtová</strong> – odhad u nových výrobků</li><li><strong>Plánová</strong> – na základě plánovaných norem</li><li><strong>Operativní</strong> – dle aktuálních norem</li></ul><strong>Výsledná kalkulace:</strong><ul><li>Skutečné náklady po dokončení výroby</li></ul>'
    },
    {
      id: 'c35', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Jak funguje kalkulace prostým dělením?',
      back: '<div class="math-block">nj = <span class="frac"><span class="frac-num">N</span><span class="frac-den">Q</span></span></div><p>Použití: pouze u <strong>homogenní produkce</strong> (jeden druh výrobku). Celkové náklady se dělí počtem kusů.</p>'
    },
    {
      id: 'c36', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Co je kalkulace ekvivalenčních čísel a kdy se používá?',
      back: '<p>Pro <strong>nehomogenní, ale podobné výrobky</strong>. Výrobky se přepočtou na společnou jednotku (SPJ).</p><div class="math-block">SPJ = &Sigma;(ik &middot; Qk)</div><p><span class="var">ik</span> = ekvivalenční číslo k-tého výrobku, <span class="var">Qk</span> = jeho objem.</p>'
    },
    {
      id: 'c37', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Jak funguje přirážková kalkulace?',
      back: '<p>Pro <strong>nehomogenní produkci</strong>. Režijní náklady se rozvrhují pomocí režijní přirážky:</p><div class="math-block">RP = <span class="frac"><span class="frac-num">RN</span><span class="frac-den">RZ</span></span> &times; 100 [%]</div><ul><li><span class="var">RN</span> = režijní náklady</li><li><span class="var">RZ</span> = rozvrhová základna (např. přímé mzdy)</li></ul>'
    },
    {
      id: 'c38', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Co je variabilní (neúplná) kalkulace a jaké jsou příspěvky na úhradu?',
      back: '<ul><li><strong>PÚ1</strong> = T - VN (příspěvek na úhradu 1 = tržby - variabilní náklady)</li><li><strong>PÚ2</strong> = PÚ1 - PFN (- přímé fixní náklady)</li><li><strong>HV</strong> = PÚ2 - SFN (- společné fixní náklady)</li></ul><p>Nerozpočítává fixní náklady na výrobek – sleduje <strong>krycí příspěvky</strong>.</p>'
    },
    {
      id: 'c39', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Jak funguje ABC kalkulace (Activity-Based Costing)?',
      back: '<p>Náklady se přiřazují přes <strong>aktivity</strong> (činnosti), ne přes objem.</p><strong>3 kroky:</strong><ol><li>Přiřadit náklady <strong>aktivitám</strong></li><li>Určit <strong>cost drivers</strong> (příčiny nákladů)</li><li>Přiřadit náklady aktivit <strong>výkonům</strong></li></ol><p>Přesnější než tradiční přirážková kalkulace.</p>'
    },
    {
      id: 'c40', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Co jsou vlastní náklady výroby?',
      back: '<div class="math-block">Vlastní náklady výroby = PM + PMZ + OPN + VR</div><p>Zahrnují přímé náklady a <strong>výrobní režii</strong>. Nezahrnují správní, zásobovací ani odbytovou režii.</p>'
    },
    {
      id: 'c41', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Co jsou vlastní náklady výkonu?',
      back: '<div class="math-block">Vlastní náklady výkonu = PM + PMZ + OPN + VR + SR</div><p>Rozšiřují vlastní náklady výroby o <strong>správní režii</strong>.</p>'
    },
    {
      id: 'c42', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Co je rozvrhová základna v přirážkové kalkulaci?',
      back: '<strong>Rozvrhová základna (RZ)</strong> = veličina, podle které se režijní náklady rozvrhují na výrobky.<br>Příklady:<ul><li>Přímé mzdy (nejčastější)</li><li>Přímý materiál</li><li>Strojové hodiny</li></ul>'
    },
    {
      id: 'c43', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Jaký je rozdíl mezi úplnou a neúplnou kalkulací?',
      back: '<ul><li><strong>Úplná kalkulace:</strong> všechny náklady (fixní i variabilní) se rozpočítají na výrobek → úplné vlastní náklady nj</li><li><strong>Neúplná (variabilní) kalkulace:</strong> na výrobek se přiřazují pouze <strong>variabilní náklady</strong>, fixní se pokrývají z krycích příspěvků</li></ul>'
    },
    {
      id: 'c44', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Co je propočtová kalkulace?',
      back: '<strong>Propočtová kalkulace</strong> = předběžná kalkulace u <strong>nových výrobků</strong>, kde ještě neexistují normy. Vychází z odhadů, srovnání s podobnými výrobky nebo z technické dokumentace.'
    },
    {
      id: 'c45', questionId: 'q3',
      front: '<span class="tag">Kalkulace</span> Co je PÚ1 ve variabilní kalkulaci?',
      back: '<div class="math-block">PÚ1 = T - VN</div><p><strong>Příspěvek na úhradu 1</strong> = tržby minus variabilní náklady. Říká, kolik výrobek přispívá na pokrytí fixních nákladů a tvorbu zisku.</p>'
    },

    // ===== Q4 - Cenová tvorba =====
    {
      id: 'c46', questionId: 'q4',
      front: '<span class="tag">Cenová tvorba</span> Co je cena?',
      back: '<strong>Cena</strong> = peněžní vyjádření hodnoty výrobku nebo služby.'
    },
    {
      id: 'c47', questionId: 'q4',
      front: '<span class="tag">Cenová tvorba</span> Jaké jsou 3 funkce ceny?',
      back: '<ul><li><strong>Informační</strong> – informuje o hodnotě produktu</li><li><strong>Alokační</strong> – ovlivňuje rozdělení zdrojů</li><li><strong>Stimulační</strong> – motivuje výrobce i spotřebitele</li></ul>'
    },
    {
      id: 'c48', questionId: 'q4',
      front: '<span class="tag">Cenová tvorba</span> Jaké jsou vnitřní faktory ovlivňující cenu?',
      back: '<ul><li><strong>Náklady</strong> (výrobní, distribuční)</li><li><strong>Marketingová strategie</strong></li><li><strong>Cíle firmy</strong> (zisk, tržní podíl, přežití)</li></ul>'
    },
    {
      id: 'c49', questionId: 'q4',
      front: '<span class="tag">Cenová tvorba</span> Jaké jsou vnější faktory ovlivňující cenu?',
      back: '<ul><li><strong>Konkurence</strong></li><li><strong>Poptávka</strong> (cenová elasticita)</li><li><strong>Ekonomické cykly</strong></li><li><strong>Inflace</strong></li></ul>'
    },
    {
      id: 'c50', questionId: 'q4',
      front: '<span class="tag">Cenová tvorba</span> Jaké jsou 3 hlavní přístupy k cenové politice?',
      back: '<ul><li><strong>Nákladově orientovaný</strong> – cena vychází z nákladů + marže</li><li><strong>Poptávkově orientovaný</strong> – cena dle vnímané hodnoty zákazníkem</li><li><strong>Konkurenčně orientovaný</strong> – cena dle konkurence</li></ul>'
    },
    {
      id: 'c51', questionId: 'q4',
      front: '<span class="tag">Cenová tvorba</span> Jak funguje metoda ziskové přirážky?',
      back: '<div class="math-block">C = nj + zp &middot; nj</div><p>kde <span class="var">nj</span> = úplné vlastní náklady na jednotku, <span class="var">zp</span> = zisková přirážka (%).</p><p>Příklad: nj = 100 Kč, zp = 20 % → C = 100 + 0,2 &times; 100 = <strong>120 Kč</strong>.</p>'
    },
    {
      id: 'c52', questionId: 'q4',
      front: '<span class="tag">Cenová tvorba</span> Jak funguje metoda rentability (ROI)?',
      back: '<div class="math-block">C = nj + <span class="frac"><span class="frac-num">ROI &middot; IN</span><span class="frac-den">Q</span></span></div><ul><li><span class="var">nj</span> = náklady na jednotku</li><li><span class="var">ROI</span> = požadovaná návratnost investice</li><li><span class="var">IN</span> = investovaný kapitál</li><li><span class="var">Q</span> = předpokládaný objem prodeje</li></ul>'
    },
    {
      id: 'c53', questionId: 'q4',
      front: '<span class="tag">Cenová tvorba</span> Co je metoda vnímané hodnoty a vzorec HHC?',
      back: '<p>Cena se stanoví dle <strong>vnímané hodnoty zákazníkem</strong> (cenová diskriminace).</p><div class="math-block">HHC = průměrná cena &times; <span class="frac"><span class="frac-num">body našeho výrobku</span><span class="frac-den">průměrné body</span></span></div><p>HHC = horní hranice ceny.</p>'
    },
    {
      id: 'c54', questionId: 'q4',
      front: '<span class="tag">Cenová tvorba</span> Co je DHC (dolní hranice ceny)?',
      back: '<strong>DHC (dolní hranice ceny)</strong> = minimální cena, pod kterou nelze jít. Obvykle se rovná <strong>variabilním nákladům na jednotku</strong> (vn). Pod touto cenou by každý prodaný kus přinášel ztrátu.'
    },
    {
      id: 'c55', questionId: 'q4',
      front: '<span class="tag">Cenová tvorba</span> Co je Target Costing?',
      back: '<strong>Target Costing</strong> = nejprve se stanoví <strong>cílová cena</strong> (z trhu), poté se odečte požadovaný zisk → výsledek jsou <strong>cílové náklady</strong>, které nesmí být překročeny.<div class="math-block">Cílové náklady = Cílová cena - Cílový zisk</div>'
    },
    {
      id: 'c56', questionId: 'q4',
      front: '<span class="tag">Cenová tvorba</span> Co je dynamická kalkulace?',
      back: '<strong>Dynamická kalkulace</strong> = zohledňuje změny nákladů a cen v čase. Kalkuluje náklady pro různé <strong>objemy produkce</strong> a sleduje, jak se mění náklady na jednotku s rostoucím/klesajícím výkonem.'
    },
    {
      id: 'c57', questionId: 'q4',
      front: '<span class="tag">Cenová tvorba</span> Jaký je rozdíl mezi nákladově a poptávkově orientovanou cenou?',
      back: '<ul><li><strong>Nákladově orientovaná:</strong> cena = náklady + marže. Jednoduchá, ale ignoruje trh.</li><li><strong>Poptávkově orientovaná:</strong> cena dle ochoty zákazníka platit. Obtížnější, ale lépe odráží tržní realitu.</li></ul>'
    },

    // ===== Q5 - Finanční účetnictví =====
    {
      id: 'c58', questionId: 'q5',
      front: '<span class="tag">Účetnictví</span> Jaké jsou 3 typy účetnictví a jejich účel?',
      back: '<ul><li><strong>Finanční účetnictví</strong> – zaznamenat a zobrazit firemní procesy v čase (pro externí uživatele)</li><li><strong>Daňové účetnictví</strong> – stanovit základ daně</li><li><strong>Manažerské účetnictví</strong> – informace pro řízení (interní)</li></ul>'
    },
    {
      id: 'c59', questionId: 'q5',
      front: '<span class="tag">Účetnictví</span> Jaké jsou mezinárodní účetní standardy?',
      back: '<ul><li><strong>US GAAP</strong> – americké účetní standardy (pravidla)</li><li><strong>IFRS</strong> – mezinárodní standardy finančního výkaznictví (principy)</li></ul><p>V EU povinné IFRS pro konsolidované účetní závěrky kótovaných společností.</p>'
    },
    {
      id: 'c60', questionId: 'q5',
      front: '<span class="tag">Účetnictví</span> Jaká je hierarchie české právní úpravy účetnictví?',
      back: '<ol><li><strong>Zákon č. 563/1991 Sb.</strong> o účetnictví</li><li><strong>Prováděcí vyhlášky</strong> (č. 500 pro podnikatele)</li><li><strong>České účetní standardy</strong></li><li><strong>Vnitropodnikové směrnice</strong></li></ol>'
    },
    {
      id: 'c61', questionId: 'q5',
      front: '<span class="tag">Účetnictví</span> Jaké jsou základní požadavky na vedení účetnictví?',
      back: 'Účetnictví musí být vedeno:<ul><li>V <strong>peněžních jednotkách</strong></li><li><strong>Úplně</strong> – zachycovat všechny účetní případy</li><li><strong>Nepřetržitě</strong> – po celou dobu existence ÚJ</li><li><strong>Soustavně</strong> – metodicky konzistentně</li><li>Na základě <strong>účetních dokladů</strong></li></ul>'
    },
    {
      id: 'c62', questionId: 'q5',
      front: '<span class="tag">Účetnictví</span> Jaké jsou hlavní typy účtů?',
      back: '<ul><li><strong>Rozvahové</strong> – aktivní (majetek) a pasivní (zdroje)</li><li><strong>Výsledkové</strong> – nákladové a výnosové</li><li><strong>Závěrkové</strong> – slouží k uzavření a otevření účtů</li><li><strong>Podrozvahové</strong> – evidence mimo rozvahu (pronájmy, záruky)</li></ul>'
    },
    {
      id: 'c63', questionId: 'q5',
      front: '<span class="tag">Účetnictví</span> Kdo je účetní jednotkou (ÚJ)?',
      back: '<ul><li><strong>Právnické osoby</strong></li><li><strong>Zahraniční právnické osoby</strong> podnikající v ČR</li><li><strong>Organizační složky státu</strong></li><li><strong>Fyzické osoby zapsané v OR</strong></li><li><strong>FO s obratem &gt; 25 mil. Kč</strong></li></ul>'
    },
    {
      id: 'c64', questionId: 'q5',
      front: '<span class="tag">Účetnictví</span> Jaké jsou kategorie účetních jednotek dle velikosti?',
      back: '<ul><li><strong>Mikro</strong> – aktiva do 9M, obrat do 18M, do 10 zaměstnanců</li><li><strong>Malá</strong> – aktiva do 100M, obrat do 200M, do 50 zaměstnanců</li><li><strong>Střední</strong> – aktiva do 500M, obrat do 1000M, do 250 zaměstnanců</li><li><strong>Velká</strong> – nad střední</li></ul><p>Překročení 2 ze 3 kritérií.</p>'
    },
    {
      id: 'c65', questionId: 'q5',
      front: '<span class="tag">Účetnictví</span> Co je princip historických cen?',
      back: '<strong>Princip historických cen</strong> = majetek se oceňuje v <strong>pořizovací ceně</strong> (ceně v okamžiku pořízení), nikoli v aktuální tržní hodnotě. Výjimky: přecenění dle IFRS, reálná hodnota u finančních nástrojů.'
    },
    {
      id: 'c66', questionId: 'q5',
      front: '<span class="tag">Účetnictví</span> Co je realizační princip?',
      back: '<strong>Realizační princip</strong> = výnosy se uznávají v okamžiku <strong>realizace</strong> (dodání výrobku/služby zákazníkovi), nikoli v okamžiku přijetí platby.'
    },
    {
      id: 'c67', questionId: 'q5',
      front: '<span class="tag">Účetnictví</span> Co jsou účetní doklady?',
      back: '<strong>Účetní doklady</strong> = průkazné záznamy o účetních případech. Musí obsahovat: označení, obsah a účastníky, peněžní částku, datum vyhotovení, datum účetního případu, podpis. Příklady: faktura, pokladní doklad, výpis z účtu.'
    },
    {
      id: 'c68', questionId: 'q5',
      front: '<span class="tag">Účetnictví</span> Jaký je rozdíl mezi US GAAP a IFRS?',
      back: '<ul><li><strong>US GAAP</strong> – založeno na <strong>pravidlech</strong> (rules-based), podrobné předpisy, USA</li><li><strong>IFRS</strong> – založeno na <strong>principech</strong> (principles-based), obecnější rámec, celosvětové</li></ul>'
    },
    {
      id: 'c69', questionId: 'q5',
      front: '<span class="tag">Účetnictví</span> Jak fungují aktivní a pasivní rozvahové účty?',
      back: '<ul><li><strong>Aktivní účty</strong> (majetek): počáteční stav a přírůstky na <strong>straně MD</strong> (Má dáti), úbytky na <strong>straně D</strong> (Dal)</li><li><strong>Pasivní účty</strong> (zdroje): počáteční stav a přírůstky na <strong>straně D</strong>, úbytky na <strong>straně MD</strong></li></ul>'
    },

    // ===== Q6 - Účetní výkazy =====
    {
      id: 'c70', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Co je rozvaha a jaké je její základní pravidlo?',
      back: '<strong>Rozvaha (bilance)</strong> = přehled majetku a zdrojů jeho krytí k určitému datu.<div class="math-block">AKTIVA = PASIVA</div><ul><li><strong>Aktiva</strong> = co firma vlastní (majetek)</li><li><strong>Pasiva</strong> = komu to patří (zdroje financování)</li></ul>'
    },
    {
      id: 'c71', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Jaká je struktura aktiv v rozvaze?',
      back: '<ol><li><strong>Pohledávky za upsaný VK</strong></li><li><strong>Stálá aktiva:</strong><ul><li>DNM (dlouhodobý nehmotný majetek)</li><li>DHM (dlouhodobý hmotný majetek)</li><li>DFM (dlouhodobý finanční majetek)</li></ul></li><li><strong>Oběžná aktiva:</strong><ul><li>Zásoby, pohledávky, KFM, peníze</li></ul></li><li><strong>Časové rozlišení</strong></li></ol>'
    },
    {
      id: 'c72', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Jaká je struktura pasiv v rozvaze?',
      back: '<ol><li><strong>Vlastní kapitál:</strong><ul><li>Základní kapitál (ZK)</li><li>Ážio a kapitálové fondy</li><li>Fondy ze zisku</li><li>VH minulých let</li><li>VH běžného účetního období</li></ul></li><li><strong>Cizí zdroje:</strong><ul><li>Rezervy</li><li>Dlouhodobé závazky</li><li>Krátkodobé závazky</li></ul></li><li><strong>Časové rozlišení</strong></li></ol>'
    },
    {
      id: 'c73', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Co je výkaz zisku a ztráty (VZZ)?',
      back: '<strong>VZZ</strong> = přehled výnosů a nákladů za účetní období.<div class="math-block">HV = V - N</div><p>Sleduje se za <strong>období</strong> (na rozdíl od rozvahy, která je k <strong>datu</strong>).</p>'
    },
    {
      id: 'c74', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Jaká je struktura VZZ – od tržeb po čistý VH?',
      back: '<ol><li><strong>Tržby</strong> - výkonová spotřeba = <strong>přidaná hodnota</strong></li><li>- osobní náklady, odpisy, ostatní → <strong>provozní VH</strong></li><li>+/- finanční výnosy/náklady → <strong>finanční VH</strong></li><li>Provozní VH + finanční VH = <strong>VH před zdaněním</strong></li><li>- daň z příjmů → <strong>VH po zdanění</strong></li></ol>'
    },
    {
      id: 'c75', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Co je cash flow (CF)?',
      back: '<strong>Cash flow</strong> = přehled peněžních toků – skutečných příjmů a výdajů za období.<ul><li><strong>Příjem</strong> = přírůstek peněz</li><li><strong>Výdaj</strong> = úbytek peněz</li></ul><p>Na rozdíl od VZZ sleduje <strong>skutečný pohyb peněz</strong>, ne výnosy/náklady.</p>'
    },
    {
      id: 'c76', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Jaké jsou 3 části výkazu cash flow?',
      back: '<ul><li><strong>Provozní CF</strong> – z hlavní činnosti (tržby, platby dodavatelům, mzdy)</li><li><strong>Investiční CF</strong> – nákup/prodej dlouhodobého majetku</li><li><strong>Finanční CF</strong> – úvěry, emise akcií, výplata dividend</li></ul>'
    },
    {
      id: 'c77', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Jaký je rozdíl mezi přímou a nepřímou metodou CF?',
      back: '<ul><li><strong>Přímá metoda:</strong> sleduje <strong>jednotlivé příjmy a výdaje</strong> – přesnější, ale pracnější</li><li><strong>Nepřímá metoda:</strong> vychází z <strong>VH</strong> a upravuje ho o nepeněžní operace (odpisy, změny pohledávek/závazků/zásob) – běžnější v praxi</li></ul>'
    },
    {
      id: 'c78', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Co je DNM, DHM a DFM?',
      back: '<ul><li><strong>DNM</strong> (dlouhodobý nehmotný majetek) – software, patenty, licence, goodwill</li><li><strong>DHM</strong> (dlouhodobý hmotný majetek) – budovy, stroje, pozemky, dopravní prostředky</li><li><strong>DFM</strong> (dlouhodobý finanční majetek) – podíly v jiných firmách, dlouhodobé cenné papíry</li></ul>'
    },
    {
      id: 'c79', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Co tvoří oběžná aktiva?',
      back: '<ul><li><strong>Zásoby</strong> – materiál, nedokončená výroba, hotové výrobky, zboží</li><li><strong>Pohledávky</strong> – krátkodobé a dlouhodobé</li><li><strong>KFM</strong> (krátkodobý finanční majetek) – cenné papíry k obchodování</li><li><strong>Peníze</strong> – hotovost a bankovní účty</li></ul>'
    },
    {
      id: 'c80', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Co je základní kapitál (ZK)?',
      back: '<strong>Základní kapitál</strong> = souhrn vkladů všech společníků do společnosti. Zapisuje se do obchodního rejstříku. U a.s. tvořen jmenovitou hodnotou akcií, u s.r.o. vklady společníků.'
    },
    {
      id: 'c81', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Co je ážio?',
      back: '<strong>Ážio</strong> = rozdíl mezi emisním kurzem (cenou, za kterou se akcie prodává) a jmenovitou hodnotou akcie. Emisní kurz ≥ jmenovitá hodnota. Ážio se eviduje ve vlastním kapitálu.'
    },
    {
      id: 'c82', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Co je časové rozlišení v rozvaze?',
      back: '<strong>Časové rozlišení</strong> = zachycení nákladů/výnosů do správného období.<br><strong>Aktivní:</strong><ul><li>Náklady příštích období (předplacené nájemné)</li><li>Příjmy příštích období</li></ul><strong>Pasivní:</strong><ul><li>Výdaje příštích období</li><li>Výnosy příštích období (přijaté zálohy)</li></ul>'
    },
    {
      id: 'c83', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Jaký je rozdíl mezi rozvahou a VZZ?',
      back: '<ul><li><strong>Rozvaha</strong> = stavový výkaz – ukazuje stav majetku a zdrojů <strong>k určitému datu</strong></li><li><strong>VZZ</strong> = tokový výkaz – ukazuje výnosy a náklady <strong>za období</strong></li></ul>'
    },
    {
      id: 'c84', questionId: 'q6',
      front: '<span class="tag">Účetní výkazy</span> Co je čistý obrat?',
      back: '<strong>Čistý obrat</strong> = celkové výnosy snížené o prodejní slevy, DPH a další nepřímé daně. Je to klíčový ukazatel velikosti firmy.'
    },

    // ===== Q7 - Finanční analýza =====
    {
      id: 'c85', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Co je finanční analýza (FA)?',
      back: '<strong>Finanční analýza</strong> = systematický rozbor finančních dat z účetních výkazů za účelem hodnocení finanční situace podniku.<ul><li><strong>Kvalitativní (fundamentální)</strong> – expertní hodnocení</li><li><strong>Kvantitativní (technická)</strong> – matematicko-statistické metody</li></ul>'
    },
    {
      id: 'c86', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Co je horizontální analýza?',
      back: '<strong>Horizontální analýza</strong> = sleduje <strong>vývoj v čase</strong>, meziroční změny.<ul><li><strong>Absolutní změna</strong> [Kč] = hodnota<sub>t</sub> - hodnota<sub>t-1</sub></li><li><strong>Relativní změna</strong> [%] = <span class="frac"><span class="frac-num">změna</span><span class="frac-den">hodnota<sub>t-1</sub></span></span> &times; 100</li></ul>'
    },
    {
      id: 'c87', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Co je vertikální analýza?',
      back: '<strong>Vertikální analýza</strong> = sleduje <strong>podíl položky na celku</strong> (např. podíl stálých aktiv na celkových aktivech). Umožňuje porovnání firem různé velikosti.'
    },
    {
      id: 'c88', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Jaké jsou vzorce pro ukazatele rentability?',
      back: '<ul><li><strong>RCK</strong> = <span class="frac"><span class="frac-num">HV</span><span class="frac-den">VK + CK</span></span> (rentabilita celk. kapitálu)</li><li><strong>ROE</strong> = <span class="frac"><span class="frac-num">HV</span><span class="frac-den">VK</span></span> (rentabilita vlastního kapitálu)</li><li><strong>ROA</strong> = <span class="frac"><span class="frac-num">HV</span><span class="frac-den">SA + OA</span></span> (rentabilita aktiv)</li><li><strong>RT</strong> = <span class="frac"><span class="frac-num">HV</span><span class="frac-den">T</span></span> (rentabilita tržeb)</li></ul>'
    },
    {
      id: 'c89', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Co měří ROE a jaký je jeho vzorec?',
      back: '<strong>ROE (Return on Equity)</strong> = rentabilita vlastního kapitálu.<div class="math-block">ROE = <span class="frac"><span class="frac-num">HV</span><span class="frac-den">VK</span></span></div><p>Měří, kolik zisku připadá na 1 Kč vlastního kapitálu. Klíčový ukazatel pro <strong>vlastníky/akcionáře</strong>.</p>'
    },
    {
      id: 'c90', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Jaké jsou ukazatele aktivity – obrat stálých aktiv a celkových aktiv?',
      back: '<ul><li><strong>OSA</strong> = <span class="frac"><span class="frac-num">T</span><span class="frac-den">SA</span></span> (obrat stálých aktiv, doporučená hodnota ≈ 5)</li><li><strong>OCA</strong> = <span class="frac"><span class="frac-num">T</span><span class="frac-den">SA + OA</span></span> (obrat celkových aktiv)</li></ul><p>Čím vyšší, tím lépe firma využívá svůj majetek.</p>'
    },
    {
      id: 'c91', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Jak se vypočítá doba obratu pohledávek a zásob?',
      back: '<ul><li><strong>Obrat pohledávek [dny]:</strong><div class="math-block">OP<sub>d</sub> = <span class="frac"><span class="frac-num">KP &middot; 365</span><span class="frac-den">T</span></span></div></li><li><strong>Obrat zásob [dny]:</strong><div class="math-block">OZ<sub>d</sub> = <span class="frac"><span class="frac-num">Z &middot; 365</span><span class="frac-den">T</span></span></div></li></ul><p>KP = krátkodobé pohledávky, Z = zásoby, T = tržby. Čím nižší, tím lepší.</p>'
    },
    {
      id: 'c92', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Jaké jsou 3 stupně likvidity a jejich vzorce?',
      back: '<ul><li><strong>L3 (běžná)</strong> = <span class="frac"><span class="frac-num">OA</span><span class="frac-den">KCK</span></span> doporučení: 1,5–2,5</li><li><strong>L2 (pohotová)</strong> = <span class="frac"><span class="frac-num">OA - zásoby</span><span class="frac-den">KCK</span></span> doporučení: 1,0–1,5</li><li><strong>L1 (okamžitá)</strong> = <span class="frac"><span class="frac-num">KFM</span><span class="frac-den">KCK</span></span> doporučení: ≈ 0,5</li></ul><p>KCK = krátkodobý cizí kapitál.</p>'
    },
    {
      id: 'c93', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Co měří L1 (okamžitá likvidita)?',
      back: '<div class="math-block">L1 = <span class="frac"><span class="frac-num">KFM</span><span class="frac-den">KCK</span></span></div><p>Měří schopnost firmy <strong>okamžitě</strong> splatit krátkodobé závazky z pohotových peněžních prostředků (hotovost, bankovní účet). Doporučená hodnota ≈ <strong>0,5</strong>.</p>'
    },
    {
      id: 'c94', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Jaké jsou ukazatele zadluženosti?',
      back: '<ul><li><strong>CZ (celková zadluženost)</strong> = <span class="frac"><span class="frac-num">CK</span><span class="frac-den">VK + CK</span></span></li><li><strong>DZ (dlouhodobá zadluženost)</strong> = <span class="frac"><span class="frac-num">DCK</span><span class="frac-den">VK + CK</span></span></li><li><strong>BZ (běžná zadluženost)</strong> = <span class="frac"><span class="frac-num">KCK</span><span class="frac-den">VK + CK</span></span></li></ul><p>CK = cizí kapitál, DCK = dlouhodobý CK, KCK = krátkodobý CK.</p>'
    },
    {
      id: 'c95', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Co je Altmanovo Z-score a jaké jsou hraniční hodnoty?',
      back: '<strong>Altmanovo Z-score</strong> = model predikce bankrotu na základě 5 finančních ukazatelů.<ul><li><strong>Z &gt; 2,99</strong> → prosperující podnik</li><li><strong>Z &lt; 1,81</strong> → hrozba bankrotu</li><li><strong>1,81–2,99</strong> → šedá zóna</li></ul>'
    },
    {
      id: 'c96', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Co je index IN05 a jaké jsou jeho zóny?',
      back: '<strong>IN05</strong> = český model hodnocení finanční situace podniku (manželé Neumaierovi).<ul><li><strong>&gt; 1,6</strong> → podnik je v pořádku</li><li><strong>&lt; 0,9</strong> → podnik má problémy</li><li><strong>0,9–1,6</strong> → šedá zóna</li></ul>'
    },
    {
      id: 'c97', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Co je EVA (ekonomická přidaná hodnota)?',
      back: '<strong>EVA (Economic Value Added)</strong> = měří, zda podnik tvoří hodnotu nad rámec nákladů na kapitál.<div class="math-block">EVA = NOPAT - WACC &times; C</div><p>EVA &gt; 0 → firma tvoří hodnotu pro vlastníky. Zohledňuje i <strong>náklady na vlastní kapitál</strong> (na rozdíl od účetního zisku).</p>'
    },
    {
      id: 'c98', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Co je BSC (Balanced Scorecard) a jaké má perspektivy?',
      back: '<strong>BSC</strong> = komplexní systém měření výkonnosti. 4 perspektivy:<ul><li><strong>Finanční</strong> – ziskovost, růst tržeb</li><li><strong>Zákaznická</strong> – spokojenost, retence, podíl na trhu</li><li><strong>Procesní</strong> (interních procesů) – efektivita, kvalita, inovace</li><li><strong>Učení se a růstu</strong> – rozvoj zaměstnanců, IT, kultura</li></ul>'
    },
    {
      id: 'c99', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Co je RT (rentabilita tržeb)?',
      back: '<div class="math-block">RT = <span class="frac"><span class="frac-num">HV</span><span class="frac-den">T</span></span></div><p>Měří, kolik zisku připadá na 1 Kč tržeb. Ukazuje <strong>ziskovou marži</strong> podniku. Nazývá se také ROS (Return on Sales).</p>'
    },
    {
      id: 'c100', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Co měří ukazatele aktivity?',
      back: '<strong>Ukazatele aktivity</strong> měří, jak efektivně firma hospodaří se svými aktivy.<ul><li><strong>Obrat</strong> (kolikrát se majetek „obrátí" v tržbách)</li><li><strong>Doba obratu</strong> (kolik dní trvá jeden obrat)</li></ul><p>Vysoký obrat = efektivní využití majetku.</p>'
    },
    {
      id: 'c101', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Co je ROA a jaký je jeho vzorec?',
      back: '<strong>ROA (Return on Assets)</strong> = rentabilita aktiv.<div class="math-block">ROA = <span class="frac"><span class="frac-num">HV</span><span class="frac-den">SA + OA</span></span></div><p>Měří, jak efektivně firma využívá <strong>veškerý svůj majetek</strong> (bez ohledu na zdroj financování) k tvorbě zisku.</p>'
    },
    {
      id: 'c102', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Jaký je rozdíl mezi Altmanovým Z-score a indexem IN05?',
      back: '<ul><li><strong>Z-score</strong> – americký model (Altman, 1968), univerzální, 5 ukazatelů</li><li><strong>IN05</strong> – český model (Neumaierovi), přizpůsobený <strong>českým podmínkám</strong></li></ul><p>Oba predikují finanční zdraví/bankrot, ale IN05 je vhodnější pro české podniky.</p>'
    },
    {
      id: 'c103', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Proč je L2 (pohotová likvidita) bez zásob?',
      back: '<div class="math-block">L2 = <span class="frac"><span class="frac-num">OA - zásoby</span><span class="frac-den">KCK</span></span></div><p>Zásoby se <strong>vylučují</strong>, protože jsou nejméně likvidní složkou oběžných aktiv – jejich přeměna na peníze trvá nejdéle. Doporučení: <strong>1,0–1,5</strong>.</p>'
    },
    {
      id: 'c104', questionId: 'q7',
      front: '<span class="tag">Finanční analýza</span> Co měří celková zadluženost (CZ)?',
      back: '<div class="math-block">CZ = <span class="frac"><span class="frac-num">CK</span><span class="frac-den">VK + CK</span></span></div><p>Podíl cizího kapitálu na celkovém kapitálu. Vyšší CZ = větší <strong>finanční riziko</strong>, ale i <strong>finanční páka</strong>. Doporučení: 30–60 %.</p>'
    },

    // ===== Q8 - Osobní obchodní společnosti + Družstvo =====
    {
      id: 'c105', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Jaké jsou typické znaky osobních obchodních společností?',
      back: '<ul><li><strong>Neomezené ručení</strong> společníků</li><li>Společnost <strong>řídí společníci</strong> (ne profesionální management)</li><li>Podíly jsou <strong>nepřevoditelné</strong></li></ul>'
    },
    {
      id: 'c106', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Co je v.o.s. (veřejná obchodní společnost)?',
      back: '<strong>V.o.s.</strong> = osobní obchodní společnost:<ul><li>Minimálně <strong>2 osoby</strong></li><li>Ručení <strong>společně a nerozdílně, neomezeně</strong> (celým majetkem)</li><li><strong>Žádná vkladová povinnost</strong></li><li>Zánik účasti společníka = zánik společnosti</li></ul>'
    },
    {
      id: 'c107', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Jak se zakládá v.o.s.?',
      back: '<ol><li><strong>Společenská smlouva</strong> – písemná forma, úředně ověřené podpisy</li><li><strong>Vznik</strong> zápisem do obchodního rejstříku (OR)</li></ol><p>Založení ≠ vznik. Společnost <strong>vzniká</strong> až zápisem do OR.</p>'
    },
    {
      id: 'c108', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Jak funguje řízení v.o.s.?',
      back: '<ul><li>Statutární orgán = <strong>všichni společníci</strong> (komplementáři)</li><li>Každý společník má <strong>1 hlas</strong></li><li>Každý společník může <strong>jednat za společnost</strong> (reprezentovat ji)</li></ul>'
    },
    {
      id: 'c109', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Co je k.s. (komanditní společnost)?',
      back: '<strong>K.s.</strong> = osobní obchodní společnost se <strong>2 druhy společníků</strong>:<ul><li><strong>Komplementář</strong> – neomezené ručení, řídí společnost</li><li><strong>Komandista</strong> – omezené ručení (do výše vkladu), vkladová povinnost</li></ul>'
    },
    {
      id: 'c110', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Kdo je statutárním orgánem k.s.?',
      back: 'Statutárním orgánem k.s. jsou <strong>komplementáři</strong>.<ul><li>Komandista <strong>nemůže</strong> být statutárním orgánem</li><li>Třetí osoba <strong>nemůže</strong> být statutárním orgánem</li></ul>'
    },
    {
      id: 'c111', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Jaký je rozdíl mezi komplementářem a komandistou?',
      back: '<table><tr><td></td><td><strong>Komplementář</strong></td><td><strong>Komandista</strong></td></tr><tr><td>Ručení</td><td>Neomezené</td><td>Omezené (do výše vkladu)</td></tr><tr><td>Vklad</td><td>Nepovinný</td><td>Povinný</td></tr><tr><td>Řízení</td><td>Ano (statut. orgán)</td><td>Ne</td></tr></table>'
    },
    {
      id: 'c112', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Co je družstvo?',
      back: '<strong>Družstvo</strong> = společenství <strong>neuzavřeného počtu osob</strong> za účelem vzájemné podpory nebo podnikání.<ul><li>Minimálně <strong>3 osoby</strong></li><li><strong>Proměnlivý</strong> základní kapitál</li><li>Příklady: bytové družstvo, sociální družstvo</li></ul>'
    },
    {
      id: 'c113', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Jaké jsou orgány družstva?',
      back: '<ul><li><strong>Členská schůze</strong> – nejvyšší orgán</li><li><strong>Shromáždění delegátů</strong> – náhrada členské schůze u velkých družstev</li><li><strong>Představenstvo</strong> – statutární orgán (min. 3 členové)</li><li><strong>Kontrolní komise</strong> – kontrolní orgán</li></ul>'
    },
    {
      id: 'c114', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Co je sociální družstvo?',
      back: '<strong>Sociální družstvo</strong> = družstvo zaměřené na integraci znevýhodněných osob do společnosti a na trh práce. Musí vyvíjet <strong>obecně prospěšnou činnost</strong>. Zisk se nerozděluje členům, ale reinvestuje.'
    },
    {
      id: 'c115', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Co znamená „ručení společně a nerozdílně" u v.o.s.?',
      back: '<strong>Solidární ručení</strong> = věřitel může požadovat splnění <strong>celého dluhu</strong> od <strong>kteréhokoli</strong> společníka. Ten, kdo zaplatil, má regresní nárok vůči ostatním. Společníci ručí <strong>celým svým osobním majetkem</strong>.'
    },
    {
      id: 'c116', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Čím se liší v.o.s. od k.s.?',
      back: '<ul><li><strong>V.o.s.:</strong> všichni společníci ručí neomezeně, žádné vklady, všichni řídí</li><li><strong>K.s.:</strong> dva typy společníků – komplementáři (neomezené ručení, řídí) a komandisté (omezené ručení, vkladová povinnost, neřídí)</li></ul>'
    },
    {
      id: 'c117', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Jaký je minimální počet členů představenstva družstva?',
      back: '<strong>3 členové</strong>. Představenstvo je <strong>statutární orgán</strong> družstva, který řídí jeho činnost a jedná za něj navenek.'
    },
    {
      id: 'c118', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Co se stane, když společník vystoupí z v.o.s.?',
      back: 'Zánik účasti společníka ve v.o.s. vede k <strong>zániku celé společnosti</strong> (pokud společenská smlouva nestanoví jinak). To je důsledek osobního charakteru v.o.s.'
    },
    {
      id: 'c119', questionId: 'q8',
      front: '<span class="tag">Osobní OBS</span> Co je bytové družstvo?',
      back: '<strong>Bytové družstvo</strong> = družstvo, jehož účelem je zajišťovat <strong>bytové potřeby svých členů</strong> (správa a údržba bytového domu). Členové jsou nájemci družstevních bytů.'
    },

    // ===== Q9 - Kapitálové obchodní společnosti =====
    {
      id: 'c120', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Jaké jsou typické znaky kapitálových obchodních společností?',
      back: '<ul><li><strong>Omezené ručení</strong> – společník nemůže přijít o víc, než vložil</li><li><strong>Profesionální management</strong> – řízení nemusí být v rukou vlastníků</li><li><strong>Volně převoditelné podíly</strong></li></ul>'
    },
    {
      id: 'c121', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Jak ručí společníci s.r.o.?',
      back: 'Společníci ručí <strong>společně a nerozdílně</strong> do výše <strong>nesplněné vkladové povinnosti</strong> (dle stavu v OR). Po splacení všech vkladů ručení <strong>zaniká</strong>.'
    },
    {
      id: 'c122', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Může být s.r.o. jednočlenná? Může sloužit i jinému účelu než podnikání?',
      back: '<ul><li><strong>Ano</strong>, s.r.o. může být <strong>jednočlenná</strong> (jeden společník)</li><li><strong>Ano</strong>, může být založena i za <strong>jiným účelem než podnikání</strong> (správa majetku, neziskové účely)</li></ul>'
    },
    {
      id: 'c123', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Jaké jsou orgány s.r.o.?',
      back: '<strong>Povinné (obligatorní):</strong><ul><li><strong>Valná hromada</strong> – nejvyšší orgán (nevolený, tvoří ji společníci)</li><li><strong>Jednatel</strong> – statutární orgán (volený)</li></ul><strong>Nepovinné (fakultativní):</strong><ul><li><strong>Dozorčí rada</strong> – kontrolní orgán</li></ul>'
    },
    {
      id: 'c124', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Jaká práva má společník s.r.o.?',
      back: '<ul><li>Právo na <strong>informace</strong></li><li>Právo na <strong>řízení</strong> (hlasování na VH)</li><li>Právo na <strong>podíl na zisku</strong></li><li>Právo na <strong>likvidační zůstatek</strong></li><li>Právo na <strong>vypořádací podíl</strong></li><li>Právo <strong>převodu podílu</strong></li><li><strong>Předkupní právo</strong></li></ul>'
    },
    {
      id: 'c125', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Co je a.s. (akciová společnost)?',
      back: '<strong>A.s.</strong> = klasická kapitálová společnost:<ul><li>Akcionáři se na řízení <strong>přímo nepodílí</strong></li><li><strong>Akcie</strong> = cenné papíry (podíl na společnosti)</li><li><strong>Neomezený počet zakladatelů</strong></li><li>Vznik: stanovy + zápis do OR</li></ul>'
    },
    {
      id: 'c126', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Jak vzniká a.s.?',
      back: '<ol><li>Přijetí <strong>stanov</strong> (zakladatelský dokument)</li><li><strong>Neomezený počet zakladatelů</strong> (i jedna osoba)</li><li><strong>Zápis do obchodního rejstříku</strong> (OR)</li></ol><p>A.s. <strong>vzniká</strong> dnem zápisu do OR.</p>'
    },
    {
      id: 'c127', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Jaké jsou pravomoci valné hromady a.s.?',
      back: 'Valná hromada rozhoduje o:<ul><li><strong>Statusových věcech</strong> – změna stanov, zrušení společnosti</li><li><strong>Majetkových otázkách</strong> – rozdělení zisku, schválení účetní závěrky</li><li><strong>Rozhodnutí o akcionářích</strong> – emise akcií, squeeze-out</li><li><strong>Organizaci</strong> – volba orgánů, odměňování</li></ul>'
    },
    {
      id: 'c128', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Jaký je rozdíl mezi monistickým a dualistickým systémem řízení a.s.?',
      back: '<ul><li><strong>Monistický systém:</strong> VH + <strong>správní rada</strong> (spojuje řízení i kontrolu)</li><li><strong>Dualistický systém:</strong> VH + <strong>představenstvo</strong> (řízení) + <strong>dozorčí rada</strong> (kontrola)</li></ul><p>A.s. si zvolí jeden z těchto systémů ve stanovách.</p>'
    },
    {
      id: 'c129', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Co je akcie?',
      back: '<strong>Akcie</strong> = cenný papír, který představuje <strong>podíl na společnosti</strong> (a.s.). Majitel akcie (akcionář) má právo na:<ul><li>Podíl na zisku (dividenda)</li><li>Hlasování na VH</li><li>Likvidační zůstatek</li></ul>'
    },
    {
      id: 'c130', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Jaký je rozdíl mezi s.r.o. a a.s.?',
      back: '<ul><li><strong>S.r.o.:</strong> podíly (ne akcie), jednatel, ručení do výše nesplněných vkladů, společníci se účastní řízení přes VH</li><li><strong>A.s.:</strong> akcie (cenné papíry), představenstvo/správní rada, akcionáři se přímo neúčastní řízení, volně obchodovatelné akcie</li></ul>'
    },
    {
      id: 'c131', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Co je představenstvo a.s.?',
      back: '<strong>Představenstvo</strong> = statutární orgán a.s. v <strong>dualistickém systému</strong>. Řídí společnost, jedná za ni navenek. Členové jsou voleni a odvoláváni <strong>valnou hromadou</strong> (nebo dozorčí radou, je-li tak stanoveno).'
    },
    {
      id: 'c132', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Co je dozorčí rada a.s.?',
      back: '<strong>Dozorčí rada</strong> = kontrolní orgán a.s. v <strong>dualistickém systému</strong>:<ul><li>Dohlíží na činnost představenstva</li><li>Kontroluje účetnictví a hospodaření</li><li>Předkládá zprávy valné hromadě</li></ul>'
    },
    {
      id: 'c133', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Co je správní rada v monistickém systému a.s.?',
      back: '<strong>Správní rada</strong> = jediný orgán řízení a kontroly v <strong>monistickém systému</strong>. Kombinuje funkce představenstva i dozorčí rady. Zjednodušuje strukturu řízení.'
    },
    {
      id: 'c134', questionId: 'q9',
      front: '<span class="tag">Kapitálové OBS</span> Co je likvidační zůstatek?',
      back: '<strong>Likvidační zůstatek</strong> = majetek, který zbude po zrušení společnosti s likvidací, po úhradě všech dluhů. Rozděluje se mezi společníky/akcionáře dle jejich podílů.'
    },

    // ===== Q10 - Závazky v obchodních vztazích =====
    {
      id: 'c135', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Co je závazek?',
      back: '<strong>Závazek</strong> = právní vztah mezi <strong>věřitelem</strong> a <strong>dlužníkem</strong>. Dlužník je povinen něco:<ul><li><strong>Dát</strong> (zaplatit, předat věc)</li><li><strong>Konat</strong> (provést dílo)</li><li><strong>Zdržet se</strong> (nekonkurovat)</li><li><strong>Strpět</strong> (umožnit průchod)</li></ul>'
    },
    {
      id: 'c136', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Co je smlouva?',
      back: '<strong>Smlouva</strong> = <strong>dvoustranné nebo vícestranné</strong> právní jednání, které zakládá, mění nebo ruší práva a povinnosti smluvních stran.'
    },
    {
      id: 'c137', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Jakými způsoby může vzniknout závazek?',
      back: '<ul><li><strong>Ze smlouvy</strong> – dohodou stran</li><li><strong>Z deliktů</strong> – způsobení škody, porušení povinnosti</li><li><strong>Z bezdůvodného obohacení</strong> – získání prospěchu bez právního důvodu</li><li><strong>Z nepřikázaného jednatelství</strong> – jednání za jiného bez jeho souhlasu</li></ul>'
    },
    {
      id: 'c138', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Jaký je proces uzavření smlouvy?',
      back: '<ol><li><strong>Návrh (nabídka/oferta)</strong> – jedna strana navrhne podmínky</li><li><strong>Přijetí (akceptace)</strong> – druhá strana návrh přijme</li><li><strong>Uzavření smlouvy</strong> – konsenzus, smlouva je platná</li></ol><p>Akceptace musí být <strong>bezpodmínečná</strong>, jinak jde o protinávrh.</p>'
    },
    {
      id: 'c139', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Co jsou obchodní podmínky?',
      back: '<strong>Obchodní podmínky</strong> = <strong>nepřímé smluvní ujednání</strong>, které se stává součástí smlouvy, pokud na ně smlouva odkazuje. Musí být druhé straně známy nebo přiloženy.'
    },
    {
      id: 'c140', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Jaké jsou způsoby změny závazků?',
      back: '<strong>Změna subjektů:</strong><ul><li>Postoupení pohledávky (cese)</li><li>Převzetí dluhu</li><li>Přistoupení k dluhu</li></ul><strong>Změna obsahu:</strong><ul><li>Dohoda stran</li><li>Narovnání</li><li>Novace (nahrazení starého závazku novým)</li></ul>'
    },
    {
      id: 'c141', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Jakými způsoby zaniká závazek?',
      back: '<ul><li><strong>Splnění</strong> (nejběžnější)</li><li><strong>Dohoda</strong> stran</li><li><strong>Započtení</strong> (vzájemné pohledávky)</li><li><strong>Odstoupení</strong> od smlouvy</li><li><strong>Výpověď</strong></li><li><strong>Nemožnost plnění</strong></li><li><strong>Smrt</strong> dlužníka/věřitele (u osobních závazků)</li><li><strong>Splynutí</strong> (věřitel = dlužník)</li><li><strong>Prominutí dluhu</strong></li><li><strong>Uplynutí doby</strong></li></ul>'
    },
    {
      id: 'c142', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Jaké jsou hlavní typy pojmenovaných smluv?',
      back: '<ul><li><strong>Kupní smlouva</strong> – převod vlastnictví za úplatu</li><li><strong>Darovací smlouva</strong> – bezúplatný převod</li><li><strong>Směnná smlouva</strong> – věc za věc</li><li><strong>Nájemní smlouva</strong> – dočasné užívání za úplatu</li><li><strong>Pachtovní smlouva</strong> – nájem + právo požívání výnosů</li><li><strong>Smlouva o dílo</strong> – zhotovení díla</li><li><strong>Příkazní smlouva</strong> – obstarání záležitosti</li></ul>'
    },
    {
      id: 'c143', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Jaký je rozdíl mezi výpůjčkou a výprosou?',
      back: '<ul><li><strong>Výpůjčka</strong> – bezúplatné užívání věci na <strong>určenou dobu</strong></li><li><strong>Výprosa</strong> – bezúplatné užívání věci <strong>bez určení doby</strong> (půjčitel může kdykoli žádat vrácení)</li></ul>'
    },
    {
      id: 'c144', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Co je zajištění dluhu a jaké jsou jeho nástroje?',
      back: '<strong>Zajištění dluhu</strong> = prostředky, které zvyšují pravděpodobnost splnění:<ul><li><strong>Ručení</strong> – třetí osoba se zaváže splnit dluh</li><li><strong>Finanční záruka</strong> – banka garantuje splnění</li><li><strong>Srážky ze mzdy</strong></li><li><strong>Zástavní právo</strong> – věc jako záruka</li></ul>'
    },
    {
      id: 'c145', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Co je utvrzení dluhu?',
      back: '<strong>Utvrzení dluhu</strong> = posiluje pozici věřitele (ale neposkytuje náhradní způsob uspokojení):<ul><li><strong>Smluvní pokuta</strong> – peněžní sankce za porušení</li><li><strong>Uznání dluhu</strong> – dlužník písemně uzná dluh (přesouvá důkazní břemeno)</li></ul>'
    },
    {
      id: 'c146', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Jaký je rozdíl mezi zajištěním a utvrzením dluhu?',
      back: '<ul><li><strong>Zajištění</strong> – poskytuje věřiteli <strong>náhradní způsob uspokojení</strong> (zástavní právo, ručení, finanční záruka)</li><li><strong>Utvrzení</strong> – pouze <strong>posiluje pozici</strong> věřitele, ale nedává náhradní zdroj (smluvní pokuta, uznání dluhu)</li></ul>'
    },
    {
      id: 'c147', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Co je postoupení pohledávky (cese)?',
      back: '<strong>Postoupení pohledávky (cese)</strong> = věřitel převede svou pohledávku na <strong>nového věřitele</strong>. Souhlas dlužníka <strong>není potřeba</strong>, ale musí být o tom vyrozuměn. Pohledávka přechází včetně příslušenství a zajištění.'
    },
    {
      id: 'c148', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Co je novace?',
      back: '<strong>Novace</strong> = dohoda stran, kterou se <strong>starý závazek nahrazuje novým</strong>. Starý závazek zaniká. Může být:<ul><li><strong>Privativní</strong> – úplné nahrazení</li><li><strong>Kumulativní</strong> – vedle starého vzniká nový</li></ul>'
    },
    {
      id: 'c149', questionId: 'q10',
      front: '<span class="tag">Závazky</span> Co je započtení pohledávek?',
      back: '<strong>Započtení (kompenzace)</strong> = vzájemné pohledávky se <strong>odečtou</strong>. Podmínky:<ul><li>Pohledávky musí být <strong>vzájemné</strong></li><li>Musí být <strong>stejného druhu</strong> (obvykle peněžní)</li><li>Musí být <strong>splatné</strong></li></ul><p>Závazek zaniká v rozsahu, v jakém se pohledávky kryjí.</p>'
    },


// Q11 – Globalizace (~15 cards)
{ id: 'c200', questionId: 'q11', front: '<span class="tag">Globalizace</span> Co je globalizace?', back: 'Spontánní, neřízený proces <strong>vzájemné integrace světa</strong> v ekonomické, politické a kulturní rovině. Dle IMF jde o rostoucí ekonomickou závislost zemí.' },
{ id: 'c201', questionId: 'q11', front: '<span class="tag">Globalizace</span> Jaké jsou klíčové historické milníky globalizace?', back: '<ul><li>Výměnný obchod v pravěku</li><li>Kolumbus 1492 – objevení Ameriky</li><li>Magalhães 1519–1522 – obeplutí Země (loď Victoria)</li><li>Martin Behaim – první globus</li><li>Propojení kontinentů obchodními cestami</li></ul>' },
{ id: 'c202', questionId: 'q11', front: '<span class="tag">Globalizace</span> Jaké vlny globalizace proběhly a co je aktuální trend?', back: 'Proběhlo několik vln globalizace, poslední před covidem. Nyní tendence k <strong>lokalizaci</strong> (deglobalizaci) a regionalizaci.' },
{ id: 'c203', questionId: 'q11', front: '<span class="tag">Globalizace</span> Jak se mění rozložení ekonomické moci?', back: 'Přesun ze <strong>Západu na Východ</strong> (Čína, Turecko). V roce 2001 Západ = 73 % světového HDP, dnes cca <strong>43 %</strong>.' },
{ id: 'c204', questionId: 'q11', front: '<span class="tag">Globalizace</span> Jaký podíl HDP měl Západ v roce 2001 a dnes?', back: '<div class="math-block">2001: Západ ≈ 73 % světového HDP<br>Dnes: ≈ 43 % světového HDP</div>Pokles o 30 procentních bodů.' },
{ id: 'c205', questionId: 'q11', front: '<span class="tag">Globalizace</span> Proč USA a Velká Británie začaly couvat z globalizace?', back: '<ul><li><strong>USA</strong> – obchodní válka s Čínou (cla, technologická rivalita)</li><li><strong>VB</strong> – Brexit (odchod z EU 2016–2020)</li></ul>Obě země se přiklánějí k protekcionismu.' },
{ id: 'c206', questionId: 'q11', front: '<span class="tag">Globalizace</span> Co je Průmysl 4.0 a jak souvisí s globalizací?', back: 'Čtvrtá průmyslová revoluce – <strong>robotizace, automatizace, digitalizace</strong>. Umožňuje výrobu blíže zákazníkovi → snižuje potřebu globálních dodavatelských řetězců.' },
{ id: 'c207', questionId: 'q11', front: '<span class="tag">Globalizace</span> Co je BRICS? Které země a kdy vznikl?', back: '<strong>BRICS</strong> – vznik 2009:<ul><li><strong>B</strong>razílie</li><li><strong>R</strong>usko</li><li><strong>I</strong>ndie</li><li><strong>Č</strong>ína</li><li><strong>J</strong>AR (South Africa)</li></ul>' },
{ id: 'c208', questionId: 'q11', front: '<span class="tag">Globalizace</span> Jaký podíl má BRICS na světové ekonomice a populaci?', back: '<ul><li>&gt; <strong>26 %</strong> světové ekonomiky</li><li><strong>41,5 %</strong> světové populace</li></ul>' },
{ id: 'c209', questionId: 'q11', front: '<span class="tag">Globalizace</span> Které země tvoří G7?', back: '<ul><li>USA</li><li>Německo</li><li>Japonsko</li><li>Velká Británie</li><li>Francie</li><li>Kanada</li><li>Itálie</li><li>+ EU (jako host)</li></ul>' },
{ id: 'c210', questionId: 'q11', front: '<span class="tag">Globalizace</span> Jaký podíl má G7 na světové ekonomice?', back: 'G7 ≈ <strong>43 % světové ekonomiky</strong>, ale se sestupným trendem (relativní pokles vůči rozvíjejícím se ekonomikám).' },
{ id: 'c211', questionId: 'q11', front: '<span class="tag">Globalizace</span> Která země BRICS je považována za jedinou silně výkonnou ekonomiku?', back: '<strong>Indie</strong> – nejvyšší tempo růstu HDP v rámci BRICS, mladá populace, silný IT sektor.' },
{ id: 'c212', questionId: 'q11', front: '<span class="tag">Globalizace</span> Jaký je postoj Číny, Indie a Brazílie k rozšíření BRICS?', back: '<strong>Čína</strong> usiluje o rozšíření BRICS (posílení vlastního vlivu). <strong>Indie a Brazílie</strong> jsou skeptické (obava z dominance Číny).' },
{ id: 'c213', questionId: 'q11', front: '<span class="tag">Globalizace</span> Kdo byl Martin Behaim a co vytvořil?', back: 'Německý kartograf, který vytvořil <strong>první známý globus</strong> (1492) – symbol propojení a vnímání světa jako celku.' },
{ id: 'c214', questionId: 'q11', front: '<span class="tag">Globalizace</span> Jak se jmenovala loď, která jako první obeplula svět?', back: 'Loď <strong>Victoria</strong> – součást výpravy Fernãa de Magalhãese (1519–1522). Magalhães sám cestu nedokončil.' },

// Q12 – Evropská unie (~18 cards)
{ id: 'c215', questionId: 'q12', front: '<span class="tag">EU</span> Co byl Schumanův plán a kdy vznikl?', back: '<strong>1950</strong> – návrh francouzského ministra Roberta Schumana na společné řízení uhlí a oceli Francie a Německa → základ evropské integrace.' },
{ id: 'c216', questionId: 'q12', front: '<span class="tag">EU</span> Co bylo ESUO a které státy ho založily?', back: '<strong>Evropské společenství uhlí a oceli</strong> (1951), 6 zakládajících států:<ul><li>Francie, Německo, Itálie</li><li>Belgie, Nizozemsko, Lucembursko</li></ul>' },
{ id: 'c217', questionId: 'q12', front: '<span class="tag">EU</span> Co přinesly Římské smlouvy 1957?', back: 'Vznik <strong>EHS</strong> (Evropské hospodářské společenství) a <strong>Euratomu</strong> (spolupráce v jaderné energetice). Základ jednotného trhu.' },
{ id: 'c218', questionId: 'q12', front: '<span class="tag">EU</span> Vyjmenuj klíčové smlouvy EU v chronologickém pořadí.', back: '<ol><li>Pařížská 1951 (ESUO)</li><li>Římské 1957 (EHS, Euratom)</li><li>Slučovací 1965</li><li>JEA 1986</li><li>Maastrichtská 1993 (vznik EU)</li><li>Amsterdamská 1999</li><li>Nice 2003</li><li>Lisabonská 2009</li></ol>' },
{ id: 'c219', questionId: 'q12', front: '<span class="tag">EU</span> Kdy bylo první rozšíření EU a které státy přistoupily?', back: '<strong>1973</strong> – Velká Británie, Irsko, Dánsko.' },
{ id: 'c220', questionId: 'q12', front: '<span class="tag">EU</span> Kdy a čím vznikla Evropská unie?', back: '<strong>Maastrichtská smlouva</strong> (Smlouva o EU), v platnosti od <strong>1. 11. 1993</strong>. Zavedla 3 pilíře: ES, SZBP, policejní a justiční spolupráce.' },
{ id: 'c221', questionId: 'q12', front: '<span class="tag">EU</span> Kdy bylo zavedeno euro?', back: '<strong>1999</strong> – bezhotovostně (11 zemí).<br><strong>2002</strong> – bankovky a mince v oběhu.' },
{ id: 'c222', questionId: 'q12', front: '<span class="tag">EU</span> Kdy proběhlo velké rozšíření EU a kolik zemí přistoupilo?', back: '<strong>2004</strong> – přistoupilo <strong>10 nových členů</strong> včetně ČR (+ Polsko, Maďarsko, Slovensko, Slovinsko, Estonsko, Lotyšsko, Litva, Kypr, Malta).' },
{ id: 'c223', questionId: 'q12', front: '<span class="tag">EU</span> Vyjmenuj 7 hlavních orgánů EU.', back: '<ol><li>Evropská rada</li><li>Rada EU</li><li>Evropská komise</li><li>Evropský parlament (705 poslanců, 5letý mandát)</li><li>Soudní dvůr EU</li><li>Evropská centrální banka (ECB)</li><li>Evropský účetní dvůr</li></ol>' },
{ id: 'c224', questionId: 'q12', front: '<span class="tag">EU</span> Kolik poslanců má Evropský parlament a jaký je mandát?', back: '<strong>705 poslanců</strong>, mandát na <strong>5 let</strong>. Přímo voleni občany členských států.' },
{ id: 'c225', questionId: 'q12', front: '<span class="tag">EU</span> Jaké přínosy má členství v EU pro ČR?', back: '<ul><li>Jednotný trh (450 mil. spotřebitelů)</li><li>Strukturální a kohezní fondy</li><li>Schengenský prostor (volný pohyb)</li><li>Možnost studia a práce v EU</li></ul>' },
{ id: 'c226', questionId: 'q12', front: '<span class="tag">EU</span> Jaká jsou negativa členství ČR v EU?', back: '<ul><li>Ztráta části suverenity</li><li>Byrokracie a regulace</li><li>Příspěvky do rozpočtu EU</li><li>Nepopulární předpisy a směrnice</li></ul>' },
{ id: 'c227', questionId: 'q12', front: '<span class="tag">EU</span> Jaké je postavení ČR v rámci EU?', back: '<ul><li>Člen skupiny V4</li><li>Mimo eurozónu</li><li>Předsednictví Rady EU: 2009 a 2022</li></ul>' },
{ id: 'c228', questionId: 'q12', front: '<span class="tag">EU</span> Jaké jsou hlavní výzvy EU?', back: '<ul><li>Green Deal 2050 (klimatická neutralita)</li><li>Digitalizace</li><li>Geopolitické výzvy</li><li>Energetická bezpečnost</li><li>Migrace</li></ul>' },
{ id: 'c229', questionId: 'q12', front: '<span class="tag">EU</span> Co je Brexit a kdy proběhl?', back: 'Odchod <strong>Velké Británie z EU</strong>. Referendum 2016, formální odchod <strong>31. 1. 2020</strong>. Přechodné období do konce 2020. Precedens opuštění EU.' },
{ id: 'c230', questionId: 'q12', front: '<span class="tag">EU</span> Jak EU reagovala na ruskou invazi na Ukrajinu?', back: '<ul><li>Sankce proti Rusku</li><li>Odpojení od SWIFT</li><li>Zmrazení aktiv ruské centrální banky</li><li>European Peace Facility (vojenská pomoc)</li><li>REPowerEU (energetická nezávislost)</li></ul>' },
{ id: 'c231', questionId: 'q12', front: '<span class="tag">EU</span> Co je Lisabonská smlouva a kdy vstoupila v platnost?', back: 'Vstoupila v platnost <strong>2009</strong>. Reformovala instituce EU, zavedla funkci stálého předsedy Evropské rady a Vysokého představitele pro zahraniční věci.' },
{ id: 'c232', questionId: 'q12', front: '<span class="tag">EU</span> Co je JEA (Jednotný evropský akt)?', back: '<strong>1986</strong> – první velká revize zakládajících smluv. Stanovil cíl dokončení <strong>jednotného vnitřního trhu do roku 1992</strong> (volný pohyb zboží, služeb, osob, kapitálu).' },

// Q13 – Mezinárodní ekonomické instituce (~18 cards)
{ id: 'c233', questionId: 'q13', front: '<span class="tag">Instituce</span> Kdy a kde vznikl IMF a kolik má členů?', back: '<strong>1944</strong> – Bretton Woodská konference. Dnes <strong>190 členů</strong>. Sídlo: Washington, D.C.' },
{ id: 'c234', questionId: 'q13', front: '<span class="tag">Instituce</span> Jaké jsou hlavní funkce IMF?', back: '<ul><li>Měnová spolupráce</li><li>Finanční stabilita</li><li>Dohled nad měnovými kurzy</li><li>Poskytování půjček zemím v krizi</li><li>Vydávání SDR (zvláštní práva čerpání)</li></ul>Kritika: podmíněnost půjček (austerita).' },
{ id: 'c235', questionId: 'q13', front: '<span class="tag">Instituce</span> Co je SDR u IMF?', back: '<strong>Special Drawing Rights</strong> (Zvláštní práva čerpání) – mezinárodní rezervní aktivum vytvořené IMF. Hodnota odvozena z koše měn (USD, EUR, CNY, JPY, GBP).' },
{ id: 'c236', questionId: 'q13', front: '<span class="tag">Instituce</span> Jakých 5 institucí tvoří Skupinu Světové banky (WBG)?', back: '<ol><li><strong>IBRD</strong> (1944) – půjčky středně příjmovým</li><li><strong>IFC</strong> (1956) – soukromý sektor</li><li><strong>IDA</strong> (1960) – nejchudší země</li><li><strong>MIGA</strong> (1988) – záruky investic</li><li><strong>ICSID</strong> (1966) – řešení investičních sporů</li></ol>' },
{ id: 'c237', questionId: 'q13', front: '<span class="tag">Instituce</span> Kdy vzniklo WTO a co bylo jeho předchůdcem?', back: 'Předchůdce: <strong>GATT</strong> (1947). <strong>WTO</strong> vzniklo <strong>1995</strong>, má <strong>164 členů</strong> pokrývajících <strong>98 % světového obchodu</strong>.' },
{ id: 'c238', questionId: 'q13', front: '<span class="tag">Instituce</span> Jaké jsou hlavní principy WTO?', back: '<ol><li><strong>Nediskriminace</strong> (MFN – doložka nejvyšších výhod)</li><li><strong>Národní zacházení</strong> (stejné podmínky pro domácí i zahraniční)</li><li><strong>Reciprocita</strong> (vzájemnost ústupků)</li><li><strong>Transparentnost</strong> (zveřejňování pravidel)</li></ol>' },
{ id: 'c239', questionId: 'q13', front: '<span class="tag">Instituce</span> Co je APEC?', back: '<strong>Asia-Pacific Economic Cooperation</strong> (1989). <strong>21 ekonomik</strong>, pokrývá <strong>60 % světového HDP</strong> a <strong>48 % obchodu</strong>. Rozhodnutí jsou <strong>nezávazná</strong> (dobrovolná spolupráce).' },
{ id: 'c240', questionId: 'q13', front: '<span class="tag">Instituce</span> Co je USMCA a co nahradila?', back: '<strong>USMCA</strong> (2020) nahradila <strong>NAFTA</strong>. Dohoda mezi USA, Mexikem a Kanadou. Pravidlo <strong>75 % komponentů</strong> z regionu. 500 mil. obyvatel, 27 % světového HDP.' },
{ id: 'c241', questionId: 'q13', front: '<span class="tag">Instituce</span> Co je MERCOSUR?', back: '<strong>1991</strong> – jihoamerická celní unie (od 1995). Členové: Argentina, Brazílie, Paraguay, Uruguay. Zaměření na volný pohyb zboží v regionu.' },
{ id: 'c242', questionId: 'q13', front: '<span class="tag">Instituce</span> Co je ASEAN a kolik má členů?', back: '<strong>Association of Southeast Asian Nations</strong> (1967). <strong>10 zemí</strong> jihovýchodní Asie, <strong>700 mil. obyvatel</strong>. Součást <strong>RCEP</strong> (2022) – největší obchodní dohoda světa.' },
{ id: 'c243', questionId: 'q13', front: '<span class="tag">Instituce</span> Jak se vyvinula G7/G8?', back: '<ul><li><strong>1975</strong> – G6 (bez Kanady)</li><li><strong>1976</strong> – G7 (+ Kanada)</li><li><strong>1997</strong> – G8 (+ Rusko)</li><li><strong>2014</strong> – zpět na G7 (Rusko vyloučeno po anexi Krymu)</li></ul>' },
{ id: 'c244', questionId: 'q13', front: '<span class="tag">Instituce</span> Co je G20 a jaký má ekonomický význam?', back: '<strong>19 zemí + EU + Africká unie</strong>. Od 2008 na úrovni lídrů. Pokrývá <strong>85 % HDP</strong> a <strong>75 % světového obchodu</strong>.' },
{ id: 'c245', questionId: 'q13', front: '<span class="tag">Instituce</span> Co je OECD a jaký je její původ?', back: 'Původně <strong>OEEC</strong> (1948) – koordinace Marshallova plánu. Přeměna na <strong>OECD 1961</strong>. Dnes <strong>38 členů</strong>. Známá projekty <strong>BEPS</strong> (daně) a <strong>PISA</strong> (vzdělávání).' },
{ id: 'c246', questionId: 'q13', front: '<span class="tag">Instituce</span> Co je BEPS a PISA v kontextu OECD?', back: '<ul><li><strong>BEPS</strong> – Base Erosion and Profit Shifting – boj proti vyhýbání se daňovým povinnostem nadnárodními firmami</li><li><strong>PISA</strong> – Programme for International Student Assessment – mezinárodní testování studentů</li></ul>' },
{ id: 'c247', questionId: 'q13', front: '<span class="tag">Instituce</span> Co je RCEP?', back: '<strong>Regional Comprehensive Economic Partnership</strong> (2022) – největší obchodní dohoda světa. Zahrnuje <strong>ASEAN + Čína, Japonsko, Jižní Korea, Austrálie, Nový Zéland</strong>.' },
{ id: 'c248', questionId: 'q13', front: '<span class="tag">Instituce</span> Jaký je rozdíl mezi IBRD a IDA ve Světové bance?', back: '<ul><li><strong>IBRD</strong> – půjčky za tržních podmínek <strong>středně příjmovým</strong> zemím</li><li><strong>IDA</strong> – zvýhodněné půjčky a granty pro <strong>nejchudší</strong> země světa</li></ul>' },
{ id: 'c249', questionId: 'q13', front: '<span class="tag">Instituce</span> Proč je IMF kritizován?', back: 'Kritika <strong>podmíněnosti půjček</strong> – požadavky na úsporná opatření (austeritu), privatizaci a liberalizaci, které mohou zhoršit situaci chudých zemí.' },
{ id: 'c250', questionId: 'q13', front: '<span class="tag">Instituce</span> Co je GATT?', back: '<strong>General Agreement on Tariffs and Trade</strong> (1947). Mnohostranná dohoda o snižování cel a obchodních bariér. V roce 1995 nahrazena <strong>WTO</strong>.' },

// Q14 – Světová hospodářská krize (~18 cards)
{ id: 'c251', questionId: 'q14', front: '<span class="tag">Krize</span> Jaké jsou hlavní ekonomické teorie vysvětlující krize?', back: '<ul><li><strong>Neoklasická</strong> – dočasné odchylky od rovnováhy</li><li><strong>Keynesiánská</strong> – nedostatečná agregátní poptávka</li><li><strong>Rakouská</strong> – nadměrná úvěrová expanze</li><li><strong>Reálný cyklus</strong> – technologické šoky</li><li><strong>Minsky</strong> – inherentní nestabilita finančních trhů</li></ul>' },
{ id: 'c252', questionId: 'q14', front: '<span class="tag">Krize</span> Co říká keynesiánská teorie o příčinách krizí?', back: 'Krize vznikají z <strong>nedostatečné agregátní poptávky</strong>. Řešení: státní zásahy (fiskální stimuly, veřejné investice) pro oživení poptávky.' },
{ id: 'c253', questionId: 'q14', front: '<span class="tag">Krize</span> Co říká Minského hypotéza finanční nestability?', back: 'Finanční trhy jsou <strong>inherentně nestabilní</strong>. V období prosperity roste riskování, dluh přechází od zajištěného přes spekulativní k Ponziho financování → nevyhnutelný krach.' },
{ id: 'c254', questionId: 'q14', front: '<span class="tag">Krize</span> Popiš Velkou hospodářskou krizi 1929–1933.', back: '<ul><li>Krach newyorské burzy (říjen 1929)</li><li>Průmyslová výroba: <strong>−38 %</strong></li><li>Nezaměstnanost v USA: <strong>25 %</strong></li><li>Globální dopad, protekcionismus, deflace</li></ul>' },
{ id: 'c255', questionId: 'q14', front: '<span class="tag">Krize</span> Co byly ropné šoky 1973 a 1979?', back: '<ul><li><strong>1973</strong> – arabské embargo (Jomkipurská válka), cena ropy 4× vyšší</li><li><strong>1979</strong> – íránská revoluce</li><li>Výsledek: <strong>stagflace</strong> (inflace + stagnace)</li><li>Konec Brettonwoodského systému fixních kurzů</li></ul>' },
{ id: 'c256', questionId: 'q14', front: '<span class="tag">Krize</span> Co byla asijská krize 1997–1998?', back: 'Začátek v <strong>Thajsku</strong> (devalvace bahtu). Masivní <strong>odliv zahraničního kapitálu</strong>. Rozšíření na Indonésii, Jižní Koreu, Malajsii. Zásah IMF.' },
{ id: 'c257', questionId: 'q14', front: '<span class="tag">Krize</span> Jaký byl dopad dot-com krize 2000–2001?', back: 'Prasknutí technologické bubliny. Index <strong>NASDAQ poklesl o 75 %</strong>. Krach řady internetových firem bez udržitelného business modelu.' },
{ id: 'c258', questionId: 'q14', front: '<span class="tag">Krize</span> Co způsobilo finanční krizi 2008?', back: '<ul><li><strong>Subprime hypotéky</strong> (rizikové dlužníky)</li><li><strong>Sekuritizace</strong> (balení hypoték do cenných papírů)</li><li>Selhání ratingových agentur</li><li>Pád <strong>Lehman Brothers</strong> (září 2008)</li><li>Synchronizovaná globální recese</li></ul>' },
{ id: 'c259', questionId: 'q14', front: '<span class="tag">Krize</span> Co je sekuritizace v kontextu krize 2008?', back: 'Proces, kdy se <strong>hypotéky balí do obchodovatelných cenných papírů</strong> (MBS, CDO). Rozptýlení rizika vedlo k jeho podcenění a systémovému selhání.' },
{ id: 'c260', questionId: 'q14', front: '<span class="tag">Krize</span> Jaké byly reakce na krizi 2008?', back: '<ul><li>Záchranné balíčky (TARP v USA)</li><li>Fiskální stimuly</li><li><strong>Kvantitativní uvolňování</strong> (QE) centrálních bank</li><li>Koordinace přes G20</li></ul>' },
{ id: 'c261', questionId: 'q14', front: '<span class="tag">Krize</span> Co byla krize eurozóny 2010–2015?', back: 'Problém: <strong>společná měna bez fiskální unie</strong>. Dluhová krize:<ul><li>Řecko – 3 záchranné programy</li><li>Irsko, Portugalsko – záchranné balíčky</li><li>Vznik EFSF → ESM</li></ul>' },
{ id: 'c262', questionId: 'q14', front: '<span class="tag">Krize</span> Co je ESM a co mu předcházelo?', back: '<strong>EFSF</strong> (European Financial Stability Facility) – dočasný fond. Nahrazen <strong>ESM</strong> (European Stability Mechanism) – stálý záchranný mechanismus eurozóny.' },
{ id: 'c263', questionId: 'q14', front: '<span class="tag">Krize</span> Co je OMT v kontextu eurokríze?', back: '<strong>Outright Monetary Transactions</strong> – program ECB pro nákup dluhopisů ohrožených zemí eurozóny. Mario Draghi: „Whatever it takes" (2012). Nikdy nebyl aktivován, ale uklidnil trhy.' },
{ id: 'c264', questionId: 'q14', front: '<span class="tag">Krize</span> Jaký ekonomický dopad měl COVID-19?', back: '<ul><li>Bezprecedentní propad ekonomik (2020)</li><li><strong>K-shaped recovery</strong> (nerovnoměrné oživení)</li><li>Narušení globálních dodavatelských řetězců</li><li>Masivní fiskální a monetární stimuly</li></ul>' },
{ id: 'c265', questionId: 'q14', front: '<span class="tag">Krize</span> Co je K-shaped recovery?', back: 'Nerovnoměrné oživení po krizi: některé sektory/skupiny se zotavují rychle (technologie, bohatí), zatímco jiné dále upadají (služby, nízké příjmy). Tvar písmene <strong>K</strong>.' },
{ id: 'c266', questionId: 'q14', front: '<span class="tag">Krize</span> Jaké trendy se objevují po krizích?', back: '<ul><li><strong>Deglobalizace</strong> a regionalizace</li><li><strong>Friend-shoring</strong> (obchod s přátelskými zeměmi)</li><li>Posun ekonomické moci k Asii</li><li>Důraz na odolnost dodavatelských řetězců</li></ul>' },
{ id: 'c267', questionId: 'q14', front: '<span class="tag">Krize</span> Co říká rakouská teorie o příčinách krizí?', back: 'Krize vznikají z <strong>nadměrné úvěrové expanze</strong> (příliš nízké úrokové sazby centrálních bank). To vede ke špatným investicím (malinvestment), které se nakonec musí zhroutit.' },
{ id: 'c268', questionId: 'q14', front: '<span class="tag">Krize</span> Co je stagflace?', back: 'Současný výskyt <strong>ekonomické stagnace</strong> (nízký/záporný růst) a <strong>vysoké inflace</strong>. Typická pro ropné šoky 70. let. Obtížně řešitelná standardními nástroji.' },

// Q15 – Krizový management (~15 cards)
{ id: 'c269', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> Co je krizový management?', back: 'Systematický proces <strong>předcházení, přípravy, reakce a obnovy</strong> v krizových situacích organizace.' },
{ id: 'c270', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> Jaké jsou typické znaky krizové situace?', back: '<ul><li>Komplexnost</li><li>Neurčitost</li><li>Časová tíseň</li><li>Vysoké riziko</li><li>Omezené zdroje</li><li>Nutnost koordinace</li></ul>' },
{ id: 'c271', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> Vyjmenuj 5 fází krize.', back: '<ol><li><strong>Potenciální</strong> – náznaky, slabé signály</li><li><strong>Latentní</strong> – viditelné projevy</li><li><strong>Akutní</strong> – krize propuká</li><li><strong>Chronická</strong> – dlouhodobé působení</li><li><strong>Vyřešení</strong> – stabilizace</li></ol>' },
{ id: 'c272', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> Co je potenciální fáze krize?', back: 'První fáze – existují pouze <strong>náznaky a slabé signály</strong>. Krize ještě není viditelná, ale problémy se začínají formovat. Klíčová pro včasnou prevenci.' },
{ id: 'c273', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> Jaký je rozdíl mezi latentní a akutní fází krize?', back: '<ul><li><strong>Latentní</strong> – projevy jsou již viditelné, ale krize ještě nevypukla naplno</li><li><strong>Akutní</strong> – krize propuká, vyžaduje okamžitou reakci</li></ul>' },
{ id: 'c274', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> Popiš 6 kroků procesu řešení krize.', back: '<ol><li>Identifikace krize</li><li>Analýza</li><li>Plánování reakce</li><li>Implementace</li><li>Kontrola a vyhodnocení</li><li>Stabilizace a obnova</li></ol>' },
{ id: 'c275', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> Jakých 5 nástrojů krizového managementu znáš?', back: '<ol><li><strong>Systém včasného varování</strong></li><li><strong>BCMS</strong> (Business Continuity – BIA, RTO, RPO)</li><li><strong>Risk management</strong></li><li><strong>Krizová komunikace</strong></li><li><strong>Řízení HR v krizi</strong></li></ol>' },
{ id: 'c276', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> Co je BCMS a co znamenají BIA, RTO, RPO?', back: '<strong>BCMS</strong> = Business Continuity Management System<ul><li><strong>BIA</strong> – Business Impact Analysis (analýza dopadů)</li><li><strong>RTO</strong> – Recovery Time Objective (max. doba obnovy)</li><li><strong>RPO</strong> – Recovery Point Objective (max. akceptovatelná ztráta dat)</li></ul>' },
{ id: 'c277', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> Jaké vlastnosti má krizový manažer?', back: '<ul><li>Orientace na <strong>nejhorší scénáře</strong></li><li><strong>Rychlé rozhodování</strong> pod tlakem</li><li><strong>Direktivní přístup</strong> vedení</li></ul>' },
{ id: 'c278', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> Jaká rizika hrozí po překonání krize?', back: '<ul><li><strong>Krizová mentalita</strong> – přetrvávání krizového režimu i po odeznění</li><li><strong>Mikromanagement</strong> – nadměrná kontrola</li><li><strong>Vyčerpání týmu</strong> – burnout z dlouhodobého stresu</li></ul>' },
{ id: 'c279', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> K čemu slouží systém včasného varování?', back: 'Monitoruje <strong>slabé signály a indikátory</strong> potenciálních hrozeb. Cíl: identifikovat krizi v potenciální nebo latentní fázi, kdy je řešení snazší a levnější.' },
{ id: 'c280', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> Proč je krizová komunikace důležitým nástrojem?', back: 'Zajišťuje <strong>transparentní, rychlé a koordinované</strong> informování zainteresovaných stran (zaměstnanci, média, veřejnost). Snižuje paniku a chrání reputaci.' },
{ id: 'c281', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> Proč je řízení HR v krizi klíčové?', back: 'Lidský faktor je v krizi rozhodující. Zahrnuje <strong>motivaci, komunikaci se zaměstnanci, zvládání stresu, přerozdělení úkolů</strong> a předcházení vyhoření týmu.' },
{ id: 'c282', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> Jaký je rozdíl mezi risk managementem a krizovým managementem?', back: '<ul><li><strong>Risk management</strong> – preventivní, identifikuje a snižuje rizika před krizí</li><li><strong>Krizový management</strong> – reaktivní, řeší situaci, když krize již nastala</li></ul>Vzájemně se doplňují.' },
{ id: 'c283', questionId: 'q15', front: '<span class="tag">Kriz. mgmt</span> Co je chronická fáze krize?', back: 'Čtvrtá fáze – krize <strong>dlouhodobě působí</strong> na organizaci. Důsledky přetrvávají, organizace se snaží o stabilizaci. Hrozí vyčerpání zdrojů a únava.' },

// Q16 – Projektové řízení (~15 cards)
{ id: 'c284', questionId: 'q16', front: '<span class="tag">Projekty</span> Co je projekt?', back: '<strong>Časově, nákladově a zdrojově omezený proces</strong> zaměřený na dosažení konkrétního cíle. Unikátní, neopakovatelný.' },
{ id: 'c285', questionId: 'q16', front: '<span class="tag">Projekty</span> Co je trojimperativ projektu?', back: 'Tři vzájemně propojené omezení:<ol><li><strong>Cíl</strong> (rozsah, kvalita)</li><li><strong>Čas</strong> (harmonogram)</li><li><strong>Náklady</strong> (rozpočet)</li></ol>Změna jednoho ovlivní ostatní.' },
{ id: 'c286', questionId: 'q16', front: '<span class="tag">Projekty</span> Jaké jsou typy projektů dle složitosti?', back: '<ul><li><strong>Komplexní</strong> – stovky činností, dlouhodobé</li><li><strong>Speciální</strong> – desítky činností, středně složité</li><li><strong>Jednoduché</strong> – malý rozsah, krátký čas</li></ul>' },
{ id: 'c287', questionId: 'q16', front: '<span class="tag">Projekty</span> Jaký je rozdíl mezi programem a portfoliem?', back: '<ul><li><strong>Program</strong> = soubor <strong>souvisejících</strong> projektů řízených koordinovaně pro dosažení společných cílů</li><li><strong>Portfolio</strong> = seskupení projektů, které <strong>nemusí být vzájemně propojeny</strong>, řízené pro strategické cíle</li></ul>' },
{ id: 'c288', questionId: 'q16', front: '<span class="tag">Projekty</span> Jaké jsou fáze životního cyklu projektu?', back: '<ol><li><strong>Předprojektová</strong> – SMART, logický rámec, WBS, síťová analýza</li><li><strong>Projektová</strong> – SoW (Statement of Work), implementační plán</li><li><strong>Poprojektová</strong> – schválení, archivace, lessons learned</li></ol>' },
{ id: 'c289', questionId: 'q16', front: '<span class="tag">Projekty</span> Co je SMART v kontextu projektů?', back: 'Pravidlo pro definici cílů:<ul><li><strong>S</strong>pecific (konkrétní)</li><li><strong>M</strong>easurable (měřitelný)</li><li><strong>A</strong>chievable (dosažitelný)</li><li><strong>R</strong>ealistic (realistický)</li><li><strong>T</strong>ime-bound (časově ohraničený)</li></ul>' },
{ id: 'c290', questionId: 'q16', front: '<span class="tag">Projekty</span> Co je WBS?', back: '<strong>Work Breakdown Structure</strong> – hierarchický rozklad projektu na menší, řiditelné části (pracovní balíčky). Základ pro plánování času, nákladů a zdrojů.' },
{ id: 'c291', questionId: 'q16', front: '<span class="tag">Projekty</span> Jaké fáze rozlišuje ISO 10-006?', back: '<ol><li>Koncepce</li><li>Vývoj</li><li>Realizace</li><li>Zakončení</li></ol>' },
{ id: 'c292', questionId: 'q16', front: '<span class="tag">Projekty</span> Jaké fáze má metodika PRINCE2?', back: '<ol><li>Starting (zahájení)</li><li>Initiating (inicializace)</li><li>Running (realizace)</li><li>Closing (ukončení)</li><li>Benefits Realisation (realizace přínosů)</li></ol>' },
{ id: 'c293', questionId: 'q16', front: '<span class="tag">Projekty</span> Co je milník v projektovém řízení?', back: '<strong>Referenční bod</strong> pro sledování pokroku projektu. Značí dokončení klíčové fáze nebo důležitou událost. Nemá dobu trvání (délka = 0).' },
{ id: 'c294', questionId: 'q16', front: '<span class="tag">Projekty</span> Jaké metody hodnocení průběhu projektu znáš?', back: '<ul><li><strong>Metoda procentního plnění</strong> (Ganttův diagram)</li><li><strong>SSD</strong> (Structured Status Display)</li><li><strong>EVM</strong> – Earned Value Management (dosažená hodnota)</li><li><strong>MTA</strong> – Milníková metoda</li></ul>' },
{ id: 'c295', questionId: 'q16', front: '<span class="tag">Projekty</span> Co je EVM (Earned Value Management)?', back: 'Metoda hodnocení výkonnosti projektu srovnávající <strong>plánovanou hodnotu (PV)</strong>, <strong>dosaženou hodnotu (EV)</strong> a <strong>skutečné náklady (AC)</strong>. Umožňuje měřit odchylky v čase i rozpočtu.' },
{ id: 'c296', questionId: 'q16', front: '<span class="tag">Projekty</span> Jaké je pravidlo dokončení úkolu v projektu?', back: 'Úkol je splněn <strong>jen při 100 %</strong> dokončení. Částečné splnění (např. 80 %) se nepočítá jako hotový úkol.' },
{ id: 'c297', questionId: 'q16', front: '<span class="tag">Projekty</span> Co je logický rámec projektu?', back: 'Matice 4×4 propojující <strong>cíle, výstupy, aktivity a zdroje</strong> s <strong>objektivně ověřitelnými ukazateli, zdroji ověření a předpoklady/riziky</strong>. Klíčový dokument předprojektové fáze.' },
{ id: 'c298', questionId: 'q16', front: '<span class="tag">Projekty</span> Co je SoW (Statement of Work)?', back: '<strong>Popis předmětu projektu</strong> – dokument definující rozsah prací, dodávky, harmonogram a kritéria přijetí. Klíčový dokument projektové fáze.' },

// Q17 – Projektové řízení zdrojů (~12 cards)
{ id: 'c299', questionId: 'q17', front: '<span class="tag">Zdroje</span> Jaké jsou hlavní plánovací dokumenty projektu?', back: '<ul><li><strong>Definice předmětu projektu</strong> (co se bude dělat)</li><li><strong>Plán projektu</strong> (jak, kdy, za kolik)</li></ul>' },
{ id: 'c300', questionId: 'q17', front: '<span class="tag">Zdroje</span> Co je metoda kritické cesty?', back: '<strong>Časově nejdelší cesta</strong> od začátku do konce projektu v síťovém diagramu. Určuje minimální dobu trvání projektu. Zpoždění na kritické cestě = zpoždění celého projektu.' },
{ id: 'c301', questionId: 'q17', front: '<span class="tag">Zdroje</span> Jaké kroky zahrnuje management zdrojů?', back: '<ol><li><strong>Identifikace</strong> zdrojů</li><li><strong>Plánování</strong> alokace</li><li><strong>Přidělování</strong> zdrojů</li></ol>Typy zdrojů: lidé, zařízení, infrastruktura.' },
{ id: 'c302', questionId: 'q17', front: '<span class="tag">Zdroje</span> Jaké jsou metody plánování nákladů projektu?', back: '<ul><li><strong>Fázové odhadování</strong> – odhadování po fázích projektu</li><li><strong>Apportioning</strong> (shora dolů) – rozdělení celkového rozpočtu na části</li><li><strong>Parametrické</strong> – odhad na základě historických dat a parametrů</li></ul>' },
{ id: 'c303', questionId: 'q17', front: '<span class="tag">Zdroje</span> Jaký je rozdíl mezi odhadem shora dolů a fázovým odhadem?', back: '<ul><li><strong>Shora dolů (apportioning)</strong> – celkový rozpočet se rozdělí na dílčí části dle zkušeností</li><li><strong>Fázový odhad</strong> – každá fáze se odhaduje samostatně, výsledky se sčítají</li></ul>' },
{ id: 'c304', questionId: 'q17', front: '<span class="tag">Zdroje</span> Jaké jsou dvě základní strategie řízení rizik?', back: '<ol><li><strong>Odstranění příčin</strong> rizika (prevence)</li><li><strong>Omezení důsledků</strong> rizika (mitigace)</li></ol>Obě se dokumentují v plánu rizik.' },
{ id: 'c305', questionId: 'q17', front: '<span class="tag">Zdroje</span> Jaké jsou kategorie příčin rizik?', back: '<ul><li><strong>Předvídatelné a ovlivnitelné</strong></li><li><strong>Neovlivnitelné</strong> (přírodní katastrofy, legislativa)</li><li><strong>Lidský faktor</strong> (chyby, absence, konflikty)</li></ul>' },
{ id: 'c306', questionId: 'q17', front: '<span class="tag">Zdroje</span> Co zahrnuje kontrola kvality projektu?', back: '<ul><li>Specifikace <strong>požadavků na kvalitu</strong></li><li>Ověření <strong>kompetentnosti subdodavatelů</strong></li><li>Stanovení <strong>kontrolních kritérií</strong></li></ul>' },
{ id: 'c307', questionId: 'q17', front: '<span class="tag">Zdroje</span> Co je plán rizik?', back: 'Dokument zahrnující <strong>identifikovaná rizika, jejich pravděpodobnost, dopad a plánované reakce</strong> (prevence, mitigace, akceptace, transfer). Průběžně aktualizovaný.' },
{ id: 'c308', questionId: 'q17', front: '<span class="tag">Zdroje</span> Proč je lidský faktor zvláštní kategorií projektových rizik?', back: 'Lidský faktor je <strong>nepředvídatelný a těžko kvantifikovatelný</strong>: chyby, nemoci, odchody klíčových pracovníků, konflikty v týmu, nedostatečné kompetence.' },
{ id: 'c309', questionId: 'q17', front: '<span class="tag">Zdroje</span> Co je parametrický odhad nákladů?', back: 'Metoda odhadu založená na <strong>historických datech</strong> a statistických parametrech (např. náklady na m² stavby, cena za funkční bod SW). Přesná, pokud existují relevantní data.' },
{ id: 'c310', questionId: 'q17', front: '<span class="tag">Zdroje</span> Co se stane, pokud se zpozdí úkol na kritické cestě?', back: 'Zpoždění na kritické cestě <strong>přímo zpožďuje celý projekt</strong>. Na rozdíl od nekritických úkolů zde neexistuje žádná časová rezerva (float = 0).' },

// Q18 – Projektový tým (~15 cards)
{ id: 'c311', questionId: 'q18', front: '<span class="tag">Tým</span> Vyjmenuj 8 Belbinových týmových rolí.', back: '<ol><li><strong>Tvůrce</strong> (Plant)</li><li><strong>Hledač zdrojů</strong> (Resource Investigator)</li><li><strong>Koordinátor</strong> (Co-ordinator)</li><li><strong>Navigátor</strong> (Shaper)</li><li><strong>Poradce-hodnotitel</strong> (Monitor Evaluator)</li><li><strong>Týmový pracovník</strong> (Teamworker)</li><li><strong>Realizátor</strong> (Implementer)</li><li><strong>Dokončovatel</strong> (Completer Finisher)</li></ol>' },
{ id: 'c312', questionId: 'q18', front: '<span class="tag">Tým</span> Kolik Belbinových rolí může mít jeden člověk?', back: 'Člověk může mít <strong>2 a více rolí</strong> – jednu <strong>dominantní</strong> a jednu <strong>skrytou</strong> (záložní). V praxi se role projevují dle kontextu a potřeb týmu.' },
{ id: 'c313', questionId: 'q18', front: '<span class="tag">Tým</span> Vyjmenuj 6 fází vývoje týmu dle Tuckmana.', back: '<ol><li><strong>Vznik</strong> (Forming)</li><li><strong>Formování</strong></li><li><strong>Bouření</strong> (Storming)</li><li><strong>Normování</strong> (Norming)</li><li><strong>Optimální výkon</strong> (Performing)</li><li><strong>Ukončení</strong> (Adjourning)</li></ol>' },
{ id: 'c314', questionId: 'q18', front: '<span class="tag">Tým</span> Co se děje ve fázi bouření (Storming)?', back: 'Fáze <strong>konfliktů a soupeření</strong>. Členové vyjadřují odlišné názory, formují se aliance, zpochybňují se role. Klíčové je konflikt konstruktivně zvládnout.' },
{ id: 'c315', questionId: 'q18', front: '<span class="tag">Tým</span> Jaké jsou kroky sestavování projektového týmu?', back: '<ol><li>Projednat zapojení s liniovými manažery</li><li>Definovat postavení v týmu</li><li>Stanovit kompetence a zodpovědnosti</li><li>Stanovit garanty</li><li>Vyhodnotit zapadnutí do týmu</li><li>Na začátku tým vzájemně seznámit</li></ol>' },
{ id: 'c316', questionId: 'q18', front: '<span class="tag">Tým</span> Jaké technické kompetence potřebuje projektový manažer?', back: '<ul><li><strong>OBS</strong> – organizační struktura projektu</li><li><strong>Síťová analýza</strong> – CPM, PERT</li><li><strong>WBS</strong> – dekompozice projektu</li></ul>' },
{ id: 'c317', questionId: 'q18', front: '<span class="tag">Tým</span> Jaké behaviorální kompetence potřebuje PM?', back: '<ul><li>Time management</li><li>Komunikace</li><li>Motivace</li><li>Vedení lidí</li><li>Řešení konfliktů</li></ul>' },
{ id: 'c318', questionId: 'q18', front: '<span class="tag">Tým</span> Jaké jsou zodpovědnosti projektového manažera?', back: '<ul><li>Řízení lidí</li><li>Monitorování průběhu</li><li>Zastupování projektu navenek</li><li>Zajišťování zdrojů</li><li>Dodržení <strong>trojimperativu</strong> (cíl, čas, náklady)</li></ul>' },
{ id: 'c319', questionId: 'q18', front: '<span class="tag">Tým</span> Jaké 3 organizační struktury se používají v projektech?', back: '<ol><li><strong>Projektová koordinace</strong> (liniově-štábní) – PM koordinuje bez přímé autority</li><li><strong>Maticová</strong> – sdílení lidí mezi linií a projektem</li><li><strong>Čistě projektová</strong> – plně dedikovaný tým pod PM</li></ol>' },
{ id: 'c320', questionId: 'q18', front: '<span class="tag">Tým</span> Jaké složky má OBS (Organization Breakdown Structure)?', back: '<ul><li>Projektový tým</li><li>Řídící výbor</li><li>Vedení projektu</li><li>Řešitelský tým</li><li>Podpůrný tým</li></ul>' },
{ id: 'c321', questionId: 'q18', front: '<span class="tag">Tým</span> Jaké jsou 4 principy OBS?', back: '<ol><li><strong>Jednoznačné přiřazení</strong> zodpovědností</li><li><strong>Delegování dle výsledků</strong></li><li><strong>Vyváženost</strong> pravomocí a zodpovědností</li><li>Odpovídající <strong>úroveň pravomoci</strong></li></ol>' },
{ id: 'c322', questionId: 'q18', front: '<span class="tag">Tým</span> Jaký je rozdíl mezi maticovou a čistě projektovou strukturou?', back: '<ul><li><strong>Maticová</strong> – členové podřízeni liniovému manažerovi i PM, sdílení zdrojů, flexibilita, ale riziko dvojího řízení</li><li><strong>Čistě projektová</strong> – tým plně dedikován projektu, jasná autorita PM, ale vyšší náklady</li></ul>' },
{ id: 'c323', questionId: 'q18', front: '<span class="tag">Tým</span> Co je fáze optimálního výkonu (Performing)?', back: 'Tým <strong>funguje efektivně a autonomně</strong>. Členové spolupracují, řeší problémy samostatně, role jsou jasné. Nejvyšší produktivita.' },
{ id: 'c324', questionId: 'q18', front: '<span class="tag">Tým</span> Jakou roli hraje koordinátor v Belbinově modelu?', back: '<strong>Koordinátor (Co-ordinator)</strong> – přirozeně vede tým, deleguje, rozpoznává schopnosti ostatních, zaměřuje tým na cíle. Není nutně nejchytřejší, ale nejlepší v řízení lidí.' },
{ id: 'c325', questionId: 'q18', front: '<span class="tag">Tým</span> Co je projektová koordinace (liniově-štábní struktura)?', back: 'PM působí jako <strong>koordinátor bez přímé autority</strong> nad členy týmu. Ti zůstávají podřízeni svým liniovým manažerům. Vhodné pro menší projekty.' },

// Q19 – Studie proveditelnosti (~12 cards)
{ id: 'c326', questionId: 'q19', front: '<span class="tag">Proveditelnost</span> Co je studie příležitostí a jaký je její výstup?', back: 'Analýza, zda je <strong>správná doba realizovat projekt</strong>. Výstup = <strong>doporučení realizovat / nerealizovat</strong> projekt.' },
{ id: 'c327', questionId: 'q19', front: '<span class="tag">Proveditelnost</span> Co obsahuje studie příležitostí?', back: '<ul><li>Analýza podnětů</li><li>Příležitosti a hrozby</li><li>Analýza problémů</li><li>Formulace záměru</li><li>Rizika</li></ul>' },
{ id: 'c328', questionId: 'q19', front: '<span class="tag">Proveditelnost</span> Co je studie proveditelnosti (Feasibility Study)?', back: '<strong>Komplexní dokument</strong> hodnotící realizovatelnost projektu. Vychází ze studie příležitostí. Posuzuje technickou, ekonomickou a organizační proveditelnost.' },
{ id: 'c329', questionId: 'q19', front: '<span class="tag">Proveditelnost</span> Jaká je struktura studie proveditelnosti?', back: '<ol><li>Úvodní informace</li><li>Popis projektu a variant</li><li>Analýza prostředí (PESTLE)</li><li>Technické řešení</li><li>Management projektu</li></ol>' },
{ id: 'c330', questionId: 'q19', front: '<span class="tag">Proveditelnost</span> Jaké analytické nástroje se používají ve studii proveditelnosti?', back: '<ul><li><strong>SWOT</strong> – silné/slabé stránky, příležitosti/hrozby</li><li><strong>PEST/PESTLE</strong> – politické, ekonomické, sociální, technologické, legislativní, environmentální faktory</li><li><strong>Porter 5 sil</strong> – konkurenční analýza</li><li><strong>CBA</strong> – analýza nákladů a přínosů</li></ul>' },
{ id: 'c331', questionId: 'q19', front: '<span class="tag">Proveditelnost</span> Jaké finanční nástroje se používají v hodnocení projektů?', back: '<ul><li><strong>NPV</strong> – čistá současná hodnota</li><li><strong>IRR</strong> – vnitřní výnosové procento</li><li><strong>Doba návratnosti</strong> (Payback Period)</li><li><strong>Break-even</strong> – bod zvratu</li></ul>' },
{ id: 'c332', questionId: 'q19', front: '<span class="tag">Proveditelnost</span> Co je NPV?', back: '<strong>Net Present Value</strong> (čistá současná hodnota) – součet diskontovaných budoucích cash flow mínus počáteční investice. <div class="math-block">NPV &gt; 0 → projekt je přijatelný</div>' },
{ id: 'c333', questionId: 'q19', front: '<span class="tag">Proveditelnost</span> Co je IRR?', back: '<strong>Internal Rate of Return</strong> (vnitřní výnosové procento) – diskontní sazba, při které NPV = 0. <div class="math-block">IRR &gt; požadovaná výnosnost → projekt je přijatelný</div>' },
{ id: 'c334', questionId: 'q19', front: '<span class="tag">Proveditelnost</span> Co je PESTLE analýza?', back: 'Analýza makroprostředí:<ul><li><strong>P</strong>olitical</li><li><strong>E</strong>conomic</li><li><strong>S</strong>ocial</li><li><strong>T</strong>echnological</li><li><strong>L</strong>egal</li><li><strong>E</strong>nvironmental</li></ul>' },
{ id: 'c335', questionId: 'q19', front: '<span class="tag">Proveditelnost</span> Jaký software se používá v projektovém řízení?', back: '<ul><li><strong>MS Project</strong> – Ganttovy diagramy, plánování zdrojů, harmonogramy</li><li><strong>Risk management SW</strong> – specializované nástroje pro řízení rizik</li></ul>' },
{ id: 'c336', questionId: 'q19', front: '<span class="tag">Proveditelnost</span> Jaký je klíčový požadavek na studii proveditelnosti?', back: 'Studie proveditelnosti musí být <strong>objektivní a realistická</strong>. Nesmí být zpracována s předem daným závěrem (potvrzovací zkreslení).' },
{ id: 'c337', questionId: 'q19', front: '<span class="tag">Proveditelnost</span> Jaký je vztah mezi studií příležitostí a studií proveditelnosti?', back: '<strong>Studie příležitostí</strong> předchází studii proveditelnosti. Pokud doporučí realizaci, zpracovává se <strong>studie proveditelnosti</strong> jako podrobnější analýza.' },

// Q20 – Etické nástroje managementu (~15 cards)
{ id: 'c338', questionId: 'q20', front: '<span class="tag">Etika</span> Co jsou etické nástroje managementu?', back: '<strong>Mechanismy pro implementaci etických principů</strong> do rozhodování a řízení organizace. Pomáhají zajistit odpovědné chování firmy.' },
{ id: 'c339', questionId: 'q20', front: '<span class="tag">Etika</span> Co jsou etické kodexy a jaká je jejich historie?', back: 'Soubory etických pravidel a norem. Historie od starověku – <strong>Hippokratova přísaha</strong> (lékařská etika). Dnes běžné v profesních organizacích i firmách.' },
{ id: 'c340', questionId: 'q20', front: '<span class="tag">Etika</span> Jaké funkce plní etické kodexy?', back: '<ul><li><strong>Regulační</strong> – stanovují pravidla</li><li><strong>Kontrolní</strong> – umožňují posuzování</li><li><strong>Motivační</strong> – inspirují k etickému jednání</li><li><strong>Edukační</strong> – vzdělávají</li><li><strong>Komunikační</strong> – sdělují hodnoty</li><li><strong>Preventivní</strong> – předcházejí neetickému chování</li></ul>' },
{ id: 'c341', questionId: 'q20', front: '<span class="tag">Etika</span> Jaký je proces aplikace etického kodexu?', back: '<ol><li><strong>Tvorba</strong> kodexu</li><li><strong>Implementace</strong> v organizaci</li><li><strong>Komunikace</strong> všem zaměstnancům</li><li><strong>Monitoring</strong> dodržování</li><li><strong>Revize</strong> a aktualizace</li></ol>' },
{ id: 'c342', questionId: 'q20', front: '<span class="tag">Etika</span> Co je CSR a jaké má pilíře?', back: '<strong>Corporate Social Responsibility</strong> – Triple-bottom-line:<ol><li><strong>Ekonomický</strong> pilíř (ziskovost)</li><li><strong>Sociální</strong> pilíř (zaměstnanci, komunita)</li><li><strong>Environmentální</strong> pilíř (životní prostředí)</li></ol>' },
{ id: 'c343', questionId: 'q20', front: '<span class="tag">Etika</span> Co je ESG a jak se liší od CSR?', back: '<strong>ESG</strong> = Environmental, Social, Governance. Na rozdíl od CSR (konceptuální rámec) je ESG zaměřeno na <strong>měřitelné ukazatele</strong> a reporting pro investory.' },
{ id: 'c344', questionId: 'q20', front: '<span class="tag">Etika</span> Jaké ISO normy souvisejí s etikou a odpovědností?', back: '<ul><li><strong>ISO 26000</strong> – CSR (společenská odpovědnost)</li><li><strong>ISO 14001</strong> – environmentální management</li><li><strong>ISO 45001</strong> – BOZP (bezpečnost práce)</li><li><strong>ISO 9001</strong> – management kvality</li></ul>' },
{ id: 'c345', questionId: 'q20', front: '<span class="tag">Etika</span> Co je GRI?', back: '<strong>Global Reporting Initiative</strong> – mezinárodní standard pro <strong>nefinanční reporting</strong>. Umožňuje firmám transparentně vykazovat dopady na společnost a životní prostředí.' },
{ id: 'c346', questionId: 'q20', front: '<span class="tag">Etika</span> Co je EMAS?', back: '<strong>Eco-Management and Audit Scheme</strong> – systém EU pro environmentální řízení a audit. Dobrovolný nástroj pro organizace, které chtějí zlepšit svou ekologickou výkonnost.' },
{ id: 'c347', questionId: 'q20', front: '<span class="tag">Etika</span> Co je Fair Trade?', back: 'Systém <strong>spravedlivého odměňování</strong> výrobců v rozvojových zemích (<strong>globální Jih</strong>). Garantuje minimální výkupní ceny a lepší pracovní podmínky.' },
{ id: 'c348', questionId: 'q20', front: '<span class="tag">Etika</span> Co je Slow Fashion?', back: '<strong>Udržitelná móda</strong> – protiklad fast fashion. Důraz na kvalitu, trvanlivost, etickou výrobu a ekologické materiály. Menší objem, vyšší hodnota.' },
{ id: 'c349', questionId: 'q20', front: '<span class="tag">Etika</span> Co je FSC?', back: '<strong>Forest Stewardship Council</strong> – certifikace <strong>odpovědného lesního hospodaření</strong>. Garantuje, že dřevo a papírové výrobky pocházejí z udržitelně spravovaných lesů.' },
{ id: 'c350', questionId: 'q20', front: '<span class="tag">Etika</span> Jaký je rozdíl mezi filantropií a sponzoringem?', back: '<ul><li><strong>Filantropie</strong> = dobrovolné dárcovství <strong>bez očekávání</strong> obchodního přínosu</li><li><strong>Sponzoring</strong> = marketingový nástroj <strong>s očekáváním návratnosti</strong> (propagace značky, PR)</li></ul>' },
{ id: 'c351', questionId: 'q20', front: '<span class="tag">Etika</span> Uveď příklady firemních nadací v ČR.', back: '<ul><li><strong>Nadace ČEZ</strong></li><li><strong>Nadace O2</strong></li><li><strong>Nadace Vodafone</strong></li></ul>Firemní nadace = forma filantropie, firma zakládá a financuje nadaci pro veřejně prospěšné účely.' },
{ id: 'c352', questionId: 'q20', front: '<span class="tag">Etika</span> Co znamenají tři písmena v ESG?', back: '<ul><li><strong>E</strong> – Environmental (životní prostředí: emise, odpady, energie)</li><li><strong>S</strong> – Social (sociální: zaměstnanci, komunita, lidská práva)</li><li><strong>G</strong> – Governance (správa: transparentnost, korupce, řízení rizik)</li></ul>' },

  ]
};
