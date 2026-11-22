/* Selbstbild – Inhalte: Checklisten, Fragebögen, externe Tests. Reine Daten, keine Logik. */
/* ---------- Checklisten ---------- */
export const G = {
 'adhs-a1': {title:'A1 · Unaufmerksamkeit', rule:'Schwelle: mindestens 5 von 9 (ab 17 Jahren), bei Kindern 6', min:5, items:[
  'Ich übersehe Details oder mache Flüchtigkeitsfehler, z. B. in E-Mails, Formularen oder Abrechnungen.',
  'Ich kann die Aufmerksamkeit bei längeren Aufgaben, Meetings oder Texten schwer halten.',
  'Andere sagen, ich höre nicht zu, obwohl sie mich direkt ansprechen; gedanklich bin ich oft woanders.',
  'Ich fange Aufgaben an und bringe sie nicht zu Ende, weil ich den Faden verliere oder abschweife.',
  'Mir fällt es schwer, Aufgaben, Termine, Unterlagen und Abläufe zu organisieren.',
  'Ich schiebe Aufgaben auf, die lange geistige Anstrengung erfordern (Steuer, Berichte, Formulare).',
  'Ich verlege oder verliere häufig Dinge wie Schlüssel, Handy, Brille oder Papiere.',
  'Ich lasse mich leicht durch Geräusche, Bewegungen oder eigene Gedanken ablenken.',
  'Ich vergesse im Alltag Dinge wie Rückrufe, Rechnungen, Termine oder Erledigungen.']},
 'adhs-a2': {title:'A2 · Hyperaktivität und Impulsivität', rule:'Schwelle: mindestens 5 von 9 (ab 17 Jahren), bei Kindern 6', min:5, items:[
  'Ich zapple mit Händen oder Füßen oder rutsche auf dem Stuhl herum.',
  'Ich stehe in Situationen auf, in denen Sitzenbleiben erwartet wird (Meeting, Restaurant, Kino).',
  ['Ich fühle mich innerlich unruhig und getrieben.','Bei Kindern zeigt sich das als Herumrennen oder Klettern.'],
  'Ruhige Freizeitbeschäftigungen fallen mir schwer, ich muss nebenbei etwas tun.',
  'Ich bin ständig in Bewegung oder „unter Strom“; anderen fällt meine Rastlosigkeit auf.',
  'Ich rede übermäßig viel.',
  'Ich platze mit Antworten heraus oder beende die Sätze anderer.',
  'Warten fällt mir schwer, z. B. in Schlangen oder bis ich im Gespräch dran bin.',
  'Ich unterbreche andere, mische mich ein oder übernehme ungefragt Dinge.']},
 'adhs-rahmen': {title:'Rahmenkriterien', rule:'Alle fünf müssen zutreffen', all:true, items:[
  ['Mehrere dieser Merkmale gab es schon vor dem 12. Lebensjahr.','Hinweise: Grundschulzeugnisse, Erinnerungen von Eltern oder Geschwistern.'],
  'Sie zeigen sich in mindestens zwei Lebensbereichen (z. B. Arbeit, Zuhause, Freundeskreis).',
  'Sie beeinträchtigen Beruf, Alltag oder Beziehungen deutlich.',
  'Sie bestehen seit mindestens 6 Monaten durchgehend, nicht nur in einer belastenden Phase.',
  'Sie lassen sich nicht besser durch etwas anderes erklären (z. B. Depression, Angst, Schlafmangel, Substanzen, Schilddrüse).']},
 'adhs-zusatz': {title:'Häufige Begleitmerkmale bei Erwachsenen', rule:'Keine offiziellen Kriterien, aber oft der eigentliche Leidensdruck', items:[
  'Meine Stimmung kippt schnell bei Frust oder Kritik und beruhigt sich ebenso schnell wieder.',
  'Kritik oder vermutete Ablehnung trifft mich ungewöhnlich heftig.',
  'Bei interessanten Themen versinke ich stundenlang (Hyperfokus) und vergesse Essen oder Zeit.',
  ['Ich schätze Zeitdauern oft falsch ein.','Typisch ist Zuspätkommen, aber auch das Gegenteil: aus Sorge um Verspätung viel zu viel Puffer und deutlich zu früh da sein.'],
  'Ich werde erst unter Deadline-Druck richtig arbeitsfähig.',
  'Langeweile fühlt sich fast körperlich unerträglich an.',
  'Ich kaufe, entscheide oder sage Dinge impulsiv und bereue es später.',
  'Abends komme ich gedanklich nicht zur Ruhe und schlafe spät ein.',
  'Vor einem Termin bin ich im „Wartemodus“: Ich kann vorher nichts anderes sinnvoll anfangen.',
  ['Ich habe häufig Kopfschmerzen oder Migräne.','Migräne ist bei ADHS häufiger, Spannungskopfschmerz dagegen nicht. Auch Stimulanzien wie Methylphenidat können Kopfschmerzen auslösen. Mehr im Reiter AuDHS unter „Kopfschmerzen“.']]},

 'aut-a1': {title:'A1 · Wechselseitigkeit', rule:'Angedeutet ab 1 Beispiel', min:1, items:[
  'Small Talk und das Hin und Her im Gespräch kosten mich viel Kraft oder gelingen nicht.',
  'Ich weiß oft nicht, wann ich in einem Gespräch dran bin, wie ich es beginne oder beende.',
  'Ich teile Gefühle oder Interessen anders mit als andere: sehr wenig oder sehr ausführlich, ohne die Reaktion abzuwarten.']},
 'aut-a2': {title:'A2 · Nonverbale Kommunikation', rule:'Angedeutet ab 1 Beispiel', min:1, items:[
  'Blickkontakt ist mir unangenehm oder ich muss ihn bewusst steuern.',
  'Mimik, Gestik und Tonfall anderer kann ich schwer deuten.',
  'Meine Mimik oder mein Tonfall wirken auf andere anders als gemeint (z. B. streng, desinteressiert, monoton).']},
 'aut-a3': {title:'A3 · Beziehungen', rule:'Angedeutet ab 1 Beispiel', min:1, items:[
  'Ungeschriebene soziale Regeln erschließen sich mir nicht intuitiv; ich habe sie mir bewusst angeeignet.',
  'Freundschaften aufzubauen oder zu halten fällt mir schwer, oder ich habe wenig Bedürfnis danach.',
  'Andeutungen, Ironie oder „Zwischen-den-Zeilen“ verstehe ich oft wörtlich oder zu spät.']},
 'aut-b1': {title:'B1 · Wiederholte Bewegungen oder Sprache', rule:'Angedeutet ab 1 Beispiel', min:1, items:[
  'Ich habe wiederkehrende Bewegungen (Wippen, Händebewegungen, mit Gegenständen spielen), die mich regulieren.',
  'Ich wiederhole Wörter, Sätze oder Geräusche oder spreche auffallend formell oder eigen.']},
 'aut-b2': {title:'B2 · Routinen und Gleichförmigkeit', rule:'Angedeutet ab 1 Beispiel', min:1, items:[
  'Unerwartete Planänderungen belasten mich stark.',
  'Ich brauche feste Abläufe, Rituale oder Gleichförmigkeit (gleiche Wege, gleiches Essen, gleiche Reihenfolge).']},
 'aut-b3': {title:'B3 · Intensive Interessen', rule:'Angedeutet ab 1 Beispiel', min:1, items:[
  'Ich habe Interessen von ungewöhnlicher Intensität oder Tiefe.',
  'Ich kann mich schwer von diesen Themen lösen; sie bestimmen Gespräche oder Freizeit.']},
 'aut-b4': {title:'B4 · Sinneswahrnehmung', rule:'Angedeutet ab 1 Beispiel', min:1, items:[
  'Geräusche, Licht, Gerüche, Texturen oder Berührungen belasten mich stark.',
  'Ich suche bestimmte Sinnesreize gezielt oder nehme Schmerz oder Temperatur kaum wahr.']},
 'aut-rahmen': {title:'Rahmenkriterien', rule:'Alle drei müssen zutreffen', all:true, items:[
  'Die Merkmale bestehen seit der frühen Kindheit, auch wenn sie erst später auffielen oder überspielt wurden.',
  'Sie führen zu deutlichen Belastungen in Beruf, Alltag oder Beziehungen.',
  'Sie lassen sich nicht besser durch eine Intelligenzminderung oder allgemeine Entwicklungsverzögerung erklären.']},
 'aut-zusatz': {title:'Häufige Begleitmerkmale', rule:'Keine offiziellen Kriterien', items:[
  ['Soziale Situationen erschöpfen mich stark, auch angenehme.','Typische Gründe: Mimik, Gestik und Tonfall bewusst deuten, selbst laut und deutlich sprechen, das Gesagte parallel verarbeiten, Geräusche des Gegenübers und der Umgebung ausfiltern, sich bewusst anpassen.'],
  'Ich hatte Phasen tiefer Erschöpfung, in denen Fähigkeiten verloren gingen (autistischer Burnout).',
  'Bei Überlastung „schalte ich ab“ (Shutdown) oder es entlädt sich heftig (Meltdown).',
  'Ich erkenne Gefühle oder Körpersignale wie Hunger, Durst und Müdigkeit schwer oder spät.',
  'Ich habe ein ausgeprägtes Gerechtigkeitsempfinden und kommuniziere sehr direkt.',
  'In Gesellschaft passe ich mich bewusst an und überspiele Eigenheiten (Masking), z. B. eingeübter Blickkontakt oder nachgeahmte Mimik und Gestik.',
  ['Ich bereite Gespräche intensiv vor: Ich lege mir Themen, Formulierungen oder ganze Abläufe zurecht und spiele sie im Kopf durch.','Auch bei Alltagsgesprächen wie Telefonaten, Arztterminen oder Small Talk. Gilt als häufige Ausgleichsstrategie für fehlendes intuitives Erfassen sozialer Situationen.'],
  ['Nach Gesprächen gehe ich sie im Kopf noch einmal durch und analysiere, was gemeint war und wie ich gewirkt habe.','Kommt auch bei sozialer Angst vor; dort steht meist die Sorge vor Bewertung im Vordergrund, bei Autismus oft das nachträgliche Entschlüsseln des Gesagten.'],
  ['Reizüberflutung oder kognitive Überlastung lösen bei mir Kopfschmerzen aus.','Migräne kommt bei autistischen Erwachsenen etwa doppelt so oft vor. Sie geht mit Licht-, Geräusch- und Geruchsempfindlichkeit einher, was sich mit autistischer Reizverarbeitung überschneidet. Mehr im Reiter AuDHS unter „Kopfschmerzen“.']]},

 'audhs-muster': {title:'Typische Wechselwirkungen', rule:'Keine offiziellen Kriterien', items:[
  'Ich brauche Routinen, langweile mich aber schnell, sobald sie bestehen.',
  'Manche Reize überfluten mich, gleichzeitig suche ich Stimulation (z. B. laute Musik zum Fokussieren, aber Kaugeräusche sind unerträglich).',
  'Meine Spezialinteressen sind intensiv, wechseln aber in Wellen.',
  'Ich plane gern und genau, scheitere aber an der Umsetzung (Anfangen, Dranbleiben).',
  'Unordnung belastet mich, Ordnung halten gelingt mir trotzdem nicht.',
  ['Ich suche Kontakt vor allem als Anregung; er wird mir aber schnell anstrengend oder langweilig, und ohne ihn fühle ich mich selten einsam.','Typische Wechselwirkung: Die ADHS-Seite sucht Anregung und Neues, und Gespräche liefern beides. Dahinter steckt eine veränderte Belohnungsverarbeitung, oft vereinfacht „Dopaminmangel“ genannt; die Anregung nutzt sich aber schnell ab. Die autistische Seite erlebt Kontakt wegen Reizen und sozialer wie emotionaler Anforderungen als anstrengend und braucht ihn weniger fürs Wohlbefinden. Alexithymie kann das verstärken, weil emotionale Anforderungen dann zusätzlich Kraft kosten.'],
  'Eine einzelne Diagnose oder Erklärung hat bei mir nie alles erklärt.',
  'Nach Phasen von Anpassung und Überforderung folgt starke Erschöpfung.',
  'Im Gespräch rede ich impulsiv und grüble danach, ob ich etwas falsch gemacht habe.',
  'Gedankenchaos und Reizüberflutung zusammen führen bei mir zu Kopfschmerzen oder starker Erschöpfung.']},

 'dep-sym': {title:'Symptome der aktuellen oder letzten Phase', rule:'Mit „Haupt“ markiert: Hauptsymptome nach ICD-10', items:[
  ['Ich bin niedergeschlagen, traurig, leer oder hoffnungslos, fast den ganzen Tag.','Hauptsymptom'],
  ['Ich habe kaum noch Interesse oder Freude, auch an Dingen, die mir sonst wichtig waren.','Hauptsymptom'],
  ['Ich habe kaum Antrieb oder Energie und bin schnell erschöpft.','Hauptsymptom (ICD-10)'],
  'Ich kann mich schlecht konzentrieren oder Entscheidungen treffen.',
  'Mein Selbstwertgefühl und Selbstvertrauen sind deutlich gesunken.',
  'Ich habe Schuldgefühle oder fühle mich wertlos.',
  'Ich sehe die Zukunft negativ und pessimistisch.',
  'Ich denke an den Tod, an Suizid oder habe mich selbst verletzt.',
  'Ich schlafe schlecht (Einschlafen, Durchschlafen, frühes Erwachen) oder deutlich mehr als sonst.',
  'Mein Appetit oder Gewicht hat sich deutlich verändert.',
  'Ich bin sichtbar verlangsamt oder innerlich und äußerlich unruhig.']},
 'dep-rahmen': {title:'Rahmenkriterien', rule:'Alle vier müssen zutreffen', all:true, items:[
  'Die Beschwerden bestehen seit mindestens 2 Wochen, fast täglich, den größten Teil des Tages.',
  'Sie sind eine deutliche Veränderung gegenüber meinem sonstigen Zustand.',
  'Sie beeinträchtigen Arbeit, Alltag oder Beziehungen.',
  'Sie sind nicht durch Substanzen, Medikamente oder eine körperliche Erkrankung erklärbar.']},
 'dys-rahmen': {title:'Dysthymie · Zeitkriterien', rule:'Beide müssen zutreffen', all:true, items:[
  'Ich bin seit mindestens 2 Jahren an mehr Tagen niedergeschlagen als nicht.',
  'In diesen 2 Jahren war ich nie länger als 2 Monate am Stück beschwerdefrei.']},
 'dys-sym': {title:'Dysthymie · Begleitsymptome', rule:'Mindestens 2 von 6', min:2, items:[
  'Appetitmangel oder übermäßiges Essen','Schlafstörung oder sehr viel Schlaf','Wenig Energie, Erschöpfung','Geringes Selbstwertgefühl','Konzentrations- oder Entscheidungsschwierigkeiten','Gefühl der Hoffnungslosigkeit']},
 'dep-verlauf': {title:'Verlauf und Zusatzmerkmale', rule:'Alles abhaken, was zutrifft', items:[
  'Es gab schon früher mindestens eine solche Phase.',
  'Zwischen den Phasen ging es mir mindestens 2 Monate weitgehend gut.',
  'Die aktuelle Phase dauert schon länger als 2 Jahre.',
  'Tiefs kommen gehäuft in Herbst und Winter und bessern sich im Frühjahr.',
  'Meine Stimmung hellt bei schönen Ereignissen spürbar auf.',
  'Dazu mindestens zwei von: deutlich mehr Appetit oder Gewicht, viel mehr Schlaf, bleierne Schwere in Armen und Beinen, starke Kränkbarkeit bei Zurückweisung.',
  'Morgens ist es am schlimmsten, ich wache sehr früh auf, und nichts kann die Stimmung aufhellen.',
  'Es gab schon einmal eine Phase mit deutlich gehobener oder gereizter Stimmung, viel Energie und wenig Schlafbedürfnis.']},

 'bip-a': {title:'A · Abgegrenzte Hochphase', rule:'Beide müssen zutreffen', all:true, items:[
  ['Es gab eine klar abgegrenzte Phase mit ungewöhnlich gehobener, überschwänglicher oder gereizter Stimmung.','„Phase“ meint mehrere Tage am Stück, nicht kurze Hochs, die innerhalb eines Tages kommen und gehen.'],
  'In dieser Phase hatte ich deutlich mehr Energie und war aktiver als sonst.']},
 'bip-b': {title:'B · Merkmale in dieser Phase', rule:'Mindestens 3 von 7, bei nur gereizter Stimmung 4', min:3, items:[
  ['Ich fühlte mich großartig, außergewöhnlich begabt oder zu Großem bestimmt.','Gemeint ist ein übersteigertes Selbstbild über Tage, nicht die kurze Begeisterung für eine Idee.'],
  ['Ich brauchte deutlich weniger Schlaf (z. B. 3 Stunden) und war trotzdem nicht müde.','Wichtigstes Unterscheidungsmerkmal: Bei ADHS ist man nach spätem Einschlafen trotzdem müde. In einer Hochphase fehlt die Müdigkeit über mehrere Nächte.'],
  ['Ich redete viel mehr und schneller als sonst und war kaum zu bremsen.','Auch bei ADHS häufig und oft mehrmals am Tag wechselnd. Zählt hier nur, wenn es über mehrere Tage am Stück deutlich stärker war als sonst.'],
  ['Meine Gedanken rasten und sprangen von Idee zu Idee.','Auch bei ADHS häufig. Zählt hier nur, wenn es über mehrere Tage am Stück deutlich stärker war als sonst.'],
  ['Ich war sehr leicht ablenkbar.','ADHS-Kernmerkmal. Zählt hier nur, wenn es über mehrere Tage am Stück deutlich stärker war als sonst.'],
  ['Ich startete viele Projekte gleichzeitig, war ungewöhnlich aktiv oder körperlich unruhig.','Ähnelt dem ADHS-Gefühl, wie von einem Motor angetrieben zu sein. Zählt hier nur, wenn es über mehrere Tage am Stück deutlich stärker war als sonst.'],
  ['Ich tat riskante Dinge mit möglichen schweren Folgen (Kaufrausch, riskante Investitionen, Affären, riskantes Fahren).','Impulskäufe und spontane riskante Entscheidungen sind auch bei ADHS häufig. Zählt hier nur, wenn sie sich über mehrere Tage am Stück deutlich häuften.']]},
 'bip-zusatz': {title:'Weitere Angaben', items:[
  'Die Stimmung war in der Hochphase vor allem gereizt, kaum euphorisch.',
  'Es gab auch depressive Phasen von mindestens 2 Wochen.',
  'Über mindestens 2 Jahre gab es immer wieder Hochs und Tiefs, die nicht ganz die Stärke einer Hypomanie oder Depression erreichten.']},

 'diff': {title:'Mein Stimmungsmuster', rule:'Hake ab, was auf dich zutrifft; die Auswertung ordnet jede Aussage einem Muster zu', items:[
  'Meine Stimmung kippt innerhalb von Minuten oder Stunden und erholt sich ebenso schnell.',
  'Tiefs werden meist durch Frust, Langeweile oder Kritik ausgelöst.',
  'Eine spannende neue Aufgabe kann ein Tief sofort „wegschalten“.',
  'Dieses Muster kenne ich, solange ich denken kann.',
  'Ein Tief hält mindestens 2 Wochen an, egal was passiert.',
  'Auch Dinge, die mir sonst Freude machen, fühlen sich leer an.',
  'Ich wache sehr früh auf und komme nicht wieder in den Schlaf; morgens ist es am schlimmsten.',
  'Es gab einen klaren Zeitpunkt, ab dem es mir anders ging als vorher.',
  'Es gab Phasen von mehreren Tagen mit kaum Schlaf, ohne dass ich müde war.',
  'In solchen Phasen fühlte ich mich großartig, redete viel und startete viele Projekte.',
  'Andere haben mich in solchen Phasen als „wie ausgewechselt“ erlebt.',
  'Hochs und Tiefs kommen in Phasen über Tage oder Wochen, nicht stündlich.']},

 'alx-dif': {title:'Gefühle erkennen', rule:'4 Aussagen', items:[
  'Ich spüre körperliche Reaktionen (Herzklopfen, Druck im Bauch), weiß aber nicht, welches Gefühl das ist.',
  'Ich bin oft unsicher, ob ich traurig, wütend, ängstlich oder einfach müde oder hungrig bin.',
  'Gefühle überrollen mich, ohne dass ich bemerkt habe, dass sie sich aufgebaut haben.',
  'Was ich gefühlt habe, verstehe ich oft erst Stunden oder Tage später.']},
 'alx-ddf': {title:'Gefühle beschreiben', rule:'4 Aussagen', items:[
  'Mir fehlen die Worte, wenn ich sagen soll, wie es mir geht.',
  'Auf „Wie geht’s dir?“ antworte ich automatisch, ohne wirklich nachspüren zu können.',
  'Andere sagen, ich wirke distanziert oder schwer zu lesen.',
  'Über Gefühle zu sprechen ist mir unangenehm oder fühlt sich fremd an.']},
 'alx-eot': {title:'Außenorientiertes Denken', rule:'4 Aussagen', items:[
  'Ich konzentriere mich lieber auf Fakten und Lösungen als auf Gefühle.',
  'Filme und Bücher interessieren mich wegen der Handlung, kaum wegen der Gefühle der Figuren.',
  'Ich analysiere Probleme lieber, als darüber nachzudenken, wie sie sich anfühlen.',
  'Gespräche über Gefühle halte ich oft für wenig nützlich.']},

 'ea2-kern': {title:'Während der Attacken', rule:'In der Literatur beschriebene EA2-Merkmale (GeneReviews, OMIM)', items:[
  ['Ich habe wiederkehrende Attacken, in denen ich unsicher stehe und gehe, als wäre ich betrunken.','„Attacke“ meint eine plötzlich einsetzende Episode, nach der es wieder besser wird.'],
  'Dabei habe ich Drehschwindel: Alles dreht sich.',
  ['Während der Attacke zittern meine Augen, oder die Umgebung springt und wackelt.','Augenzittern (Nystagmus), ähnlich wie nach schnellem Drehen auf einem Drehstuhl.'],
  'Ich sehe während der Attacke doppelt.',
  'Meine Sprache wird während der Attacke verwaschen.',
  'Dabei ist mir übel oder ich muss erbrechen.',
  'Während der Attacke habe ich Ohrgeräusche (Tinnitus).',
  'Während der Attacke fühlen sich Arme oder Beine schwach an.',
  'Während der Attacke sind Hände und Arme ungeschickt, Greifen und Zielen gelingen schlecht.']},
 'ea2-ausloeser': {title:'Wann treten die Attacken auf?', rule:'Alles abhaken, was eine Attacke auslösen kann', items:[
  ['Bei Sport oder stärkerer körperlicher Anstrengung.','Als Auslöser beschrieben.'],
  ['Schon bei leichter, aber länger anhaltender körperlicher Belastung.','Beschrieben ist körperliche Anstrengung allgemein; wie viel nötig ist, ist individuell verschieden.'],
  ['Bei längerer Anforderung an das Gleichgewicht, z. B. Gehen auf unebenem Boden.','Als EA2-Auslöser nicht ausdrücklich beschrieben. Unebener Boden fordert das Gleichgewicht stärker und macht Unsicherheit bei Kleinhirn- und Gleichgewichtsstörungen generell deutlicher.'],
  ['Bei plötzlichen Bewegungen.','Als Auslöser beschrieben.'],
  ['Bei emotionalem Stress oder Aufregung.','Als Auslöser beschrieben.'],
  ['Bei Müdigkeit oder Erschöpfung.','Als Auslöser beschrieben.'],
  ['Bei Fieber, Hitze oder Überwärmung, z. B. Sauna oder heißes Bad.','Als Auslöser beschrieben.'],
  ['Bei bestimmten Kopfhaltungen, z. B. Hinlegen, Umdrehen im Bett, Blick nach oben.','Typisch für gutartigen Lagerungsschwindel, nicht für EA2.'],
  ['Bei überraschenden Störungen beim Gehen, z. B. irgendwo anstoßen oder in ein Schlagloch treten.','Entspricht den beschriebenen Auslösern „plötzliche Bewegung“ und Schreck; Schreck ist vor allem bei EA1 beschrieben.']]},
 'ea2-verlauf': {title:'Verlauf, Befunde und Familie', rule:'In der Literatur beschriebene EA2-Merkmale', items:[
  ['Die ersten Attacken hatte ich in Kindheit oder Jugend.','Beschrieben ist ein Beginn meist in Kindheit oder früher Jugend, Spanne etwa 2 bis 32 Jahre.'],
  ['Ähnliche Attacken gibt es bei Verwandten.','EA2 wird autosomal-dominant vererbt; sie kann aber auch neu auftreten.'],
  ['Ärzt:innen haben ein Augenzittern beim Blick zur Seite oder nach unten festgestellt, auch zwischen den Attacken.','Selbst kaum zu bemerken; Befund aus einer Untersuchung.'],
  'Auch zwischen den Attacken bin ich zunehmend leicht unsicher beim Gehen.',
  ['Ich habe migräneartige Kopfschmerzen.','Etwa die Hälfte der Menschen mit EA2 hat Migräne. Dasselbe Gen verursacht auch die familiäre hemiplegische Migräne (FHM1).'],
  ['Acetazolamid oder 4-Aminopyridin hat die Attacken verringert.','Gutes Ansprechen stützt die Diagnose.']]},
 'ea2-weitere': {title:'Weitere Beobachtungen', rule:'Nicht spezifisch für EA2; fließen nur in die Abgrenzung ein', items:[
  ['Bei einer Attacke stürze ich oder muss mich sofort hinsetzen oder festhalten.','Folge starker Unsicherheit; in der Literatur nicht als eigenes Merkmal beschrieben.'],
  ['Nach der eigentlichen Attacke bleiben Schwindel oder Gangunsicherheit noch eine Weile bestehen.','Nicht eigens beschrieben; bei EA2 gehört das meist zur Attacke dazu.'],
  ['Nach einer Attacke ist meine körperliche Leistungsfähigkeit für den Rest des Tages weg.','Beschrieben ist Schwäche während der Attacke. Anhaltende Erschöpfung danach ist nicht spezifisch und kommt z. B. auch nach Migräneattacken vor.'],
  ['Schlaf lässt die Beschwerden abklingen.','Bei EA2 in einem Fallbericht beschrieben, ebenso bei Migräne und beim Mount-Reback-Syndrom; kein Unterscheidungsmerkmal.'],
  ['Bei oder nach einer Attacke bin ich kurz weggetreten, verwirrt oder habe eine Erinnerungslücke.','Gemeint ist eine Störung des Bewusstseins, nicht starker Drehschwindel. Gehört nicht zum EA2-Bild und sollte ärztlich eingeordnet werden.'],
  ['Während der Attacken höre ich auf einem Ohr schlechter oder habe Ohrdruck.','Typisch für Morbus Menière.']]},

 'dk-zahl': {title:'Zahlverständnis', items:[
  'Kleine Mengen (z. B. 6 Punkte) erfasse ich nicht auf einen Blick, sondern zähle nach.',
  'Beim Größenvergleich von Zahlen bin ich unsicher (z. B. ob 0,25 größer ist als 0,3).',
  'Stellenwerte (Zehner, Hunderter, Nachkommastellen) verwechsle ich.',
  ['Beim Denken, Kopfrechnen oder Merken vertausche ich Ziffern, z. B. wird aus 63 eine 36.','Im Deutschen häufig, weil Zahlwörter die Einer vor den Zehnern nennen („drei-und-sechzig“). Solche Zahlendreher nehmen mit der Belastung des Arbeitsgedächtnisses zu und kommen deshalb auch bei ADHS vor. Allein sind sie kein Zeichen einer Rechenstörung.']]},
 'dk-rechnen': {title:'Rechnen', items:[
  ['Einfache Aufgaben wie 2 × 4 oder 3 + 5 weiß ich nicht auswendig, sondern zähle sie ab, mit den Fingern oder im Kopf (z. B. 2 × 4: „4 … 5, 6, 7, 8“).','Schwierigkeiten, einfache Rechenergebnisse aus dem Gedächtnis abzurufen, gelten als das am besten belegte Merkmal einer Rechenstörung. Stattdessen werden Zählstrategien genutzt, auch ohne sichtbare Finger. DSM-5 nennt als Beispiel das Abzählen an den Fingern statt des Abrufens.'],
  'Rechenwege vergesse ich wieder, auch wenn ich sie oft geübt habe.',
  'Ich verwechsle Rechenzeichen oder Rechenarten.',
  'Prozent, Brüche oder Dreisatz verstehe ich auch mit Erklärung kaum.']},
 'dk-alltag': {title:'Alltag', items:[
  'Wechselgeld, Trinkgeld oder Rabatte im Kopf zu überschlagen fällt mir sehr schwer.',
  'Analoge Uhrzeit, Zeitdauern oder Fahrpläne erfasse ich schwer.',
  'Entfernungen, Mengen und Maße (z. B. in Rezepten) schätze ich unsicher ein.',
  'Telefonnummern oder PINs kann ich mir schwer merken.',
  'Bei Zahlen bekomme ich Angst oder vermeide sie.']},
 'dk-vg': {title:'Vorgeschichte', items:[
  'Mathe war schon in der Grundschule deutlich schwächer als meine anderen Fächer.',
  'Trotz Nachhilfe oder Förderung habe ich kaum Fortschritte gemacht.']},

 'dp-grob': {title:'Grobmotorik', items:[
  'Ich stolpere oder stoße mich häufig und habe blaue Flecken, ohne zu wissen woher.',
  'Neue Bewegungsabläufe (Tanzschritte, Sportarten, Radfahren) lerne ich deutlich langsamer.',
  'Ballspiele, Fangen und Werfen fallen mir schwer.',
  'Gleichgewicht ist schwierig, z. B. Treppen ohne Geländer oder Balancieren.']},
 'dp-fein': {title:'Feinmotorik', items:[
  'Meine Handschrift ist langsam, schwer lesbar oder anstrengend.',
  'Knöpfe, Schnürsenkel, Reißverschlüsse oder Werkzeuge bereiten mir Mühe.',
  'Mir fallen häufig Dinge herunter oder ich verschütte etwas.',
  'Rasieren, Schminken oder Haare machen erfordert viel Konzentration.']},
 'dp-alltag': {title:'Planung und Alltag', items:[
  ['Abläufe in der richtigen Reihenfolge zu planen (Kochen, Packen) fällt mir schwer.','Überschneidet sich mit ADHS.'],
  'Räumliche Orientierung, links und rechts, Einparken oder Kartenlesen sind schwierig.',
  'Autofahren zu lernen hat bei mir deutlich länger gedauert als bei anderen.',
  'Die ständige Bewegungskontrolle erschöpft mich körperlich.']},
 'dp-vg': {title:'Vorgeschichte', items:[
  'Krabbeln, Laufen, Radfahren oder Schleife binden habe ich später gelernt als andere Kinder.',
  'Im Sportunterricht war ich deutlich schwächer oder wurde zuletzt gewählt.']},

 'mig-attacke': {title:'Der Kopfschmerz selbst', rule:'Migränekriterium: mindestens 2 von 4', min:2, items:[
  ['Der Schmerz sitzt auf einer Seite; die Seite kann wechseln.','Kein Muss: Bei vielen Menschen mit Migräne sitzt er zumindest zeitweise beidseitig, am Scheitel oder in der Kopfmitte.'],
  'Der Schmerz pocht oder pulsiert.',
  'Er ist mittelstark bis stark; der Alltag ist deutlich erschwert oder unmöglich.',
  'Körperliche Routine wie Treppensteigen, Bücken oder Gehen verstärkt ihn, oder ich meide sie deshalb.']},
 'mig-begleit': {title:'Während des Kopfschmerzes', rule:'Migränekriterium: mindestens 1 von 2', min:1, items:[
  'Mir ist übel oder ich muss erbrechen.',
  ['Licht und Geräusche sind beide deutlich unangenehmer als sonst.','Gemeint ist die Zunahme während des Kopfschmerzes. Wer Licht und Geräusche auch sonst als belastend erlebt, etwa bei Autismus, zählt hier nur die Verstärkung. Stört nur eines von beiden, spricht das eher für Spannungskopfschmerz.']]},
 'mig-verlauf': {title:'Verlauf, Medikamente', items:[
  'Ich hatte schon mindestens 5 solcher Kopfschmerzattacken.',
  'Die Kopfschmerzen bestehen in dieser Häufigkeit seit mehr als 3 Monaten.',
  ['An mindestens 8 Tagen im Monat hat der Kopfschmerz die Migränemerkmale oben.','Gemeint: pulsierend oder stark, mit Übelkeit oder mit Licht- und Lärmempfindlichkeit. Wichtig für die chronische Migräne bei 15 oder mehr Kopfschmerztagen.'],
  ['Ein Triptan lindert den Kopfschmerz deutlich.','Triptane sind Migränemittel, z. B. Sumatriptan. Bei Spannungskopfschmerz wirken sie nicht.'],
  ['Der tägliche Kopfschmerz begann an einem Tag, den ich noch genau benennen kann, und ist seitdem jeden Tag da.','Kennzeichen des neu aufgetretenen täglichen Kopfschmerzes (NDPH): täglich und anhaltend innerhalb von 24 Stunden nach Beginn.'],
  ['Triptane, Kombinationsschmerzmittel oder Opioide nehme ich an 10 oder mehr Tagen im Monat.','Über mehr als 3 Monate kann das selbst Kopfschmerzen unterhalten (Kopfschmerz bei Medikamentenübergebrauch).'],
  ['Einfache Schmerzmittel wie Ibuprofen, Paracetamol oder ASS nehme ich an 15 oder mehr Tagen im Monat.','Über mehr als 3 Monate kann das selbst Kopfschmerzen unterhalten.']]},
 'mig-aura': {title:'Aura · Art der Symptome', rule:'Mindestens 1, bei mindestens 2 Attacken, jeweils vollständig zurückgehend', min:1, items:[
  'Ich sehe Flimmern, Zickzacklinien oder einen Ausfall im Gesichtsfeld.',
  'Kribbeln oder Taubheit in Hand, Arm oder Gesicht.',
  ['Vorübergehend finde ich keine Worte oder kann nicht richtig sprechen.','Gemeint ist eine Aura von Minuten bis einer Stunde, danach ist alles wieder normal. Allgemeine Wortfindungsprobleme rund um Attacken gehören weiter unten zu den Vor- und Nachphasen.'],
  ['Eine Körperseite wird schwach oder gelähmt.','Typisch für hemiplegische Migräne, u. a. durch das Gen CACNA1A wie bei der episodischen Ataxie Typ 2. Eine erstmalige Lähmung immer sofort abklären lassen (Notruf 112).']]},
 'mig-aura-c': {title:'Aura · Verlauf', rule:'Migränekriterium: mindestens 3 von 6', min:3, items:[
  'Mindestens ein Symptom breitet sich langsam über 5 Minuten oder länger aus.',
  'Zwei oder mehr Symptome folgen nacheinander, z. B. erst Sehstörung, dann Kribbeln.',
  'Jedes Symptom dauert 5 bis 60 Minuten.',
  ['Mindestens ein Symptom betrifft nur eine Seite.','Z. B. eine Gesichtsfeldhälfte oder eine Hand. Sprachstörungen zählen immer als einseitig.'],
  ['Mindestens ein Symptom ist „positiv“.','Etwas kommt hinzu, z. B. Flimmern oder Kribbeln, statt dass nur etwas ausfällt.'],
  'Kopfschmerz begleitet die Aura oder folgt innerhalb von 60 Minuten.']},
 'mig-phasen': {title:'Vorphase, Nachphase und Begleitzeichen', rule:'Häufig bei Migräne, aber nicht Teil der Kriterien', items:[
  'Stunden bis Tage vorher kündigt sich die Attacke an, z. B. durch Müdigkeit, Gähnen, Reizbarkeit oder Konzentrationsprobleme.',
  ['Vor einer Attacke habe ich Heißhunger, z. B. auf Süßes.','Gehört oft schon zur Vorphase. Was man dann isst, wird leicht für den Auslöser gehalten. Auch ADHS kann zu Heißhunger beitragen, etwa über vergessene Mahlzeiten, impulsives Essen oder das Nachlassen von Stimulanzien am Abend; dann ist er kein sicheres Migränezeichen.'],
  ['Nackenschmerzen kommen mit der Attacke, kurz davor oder währenddessen.','In einer großen Studie bei gut 40 % der Vorphasen beschrieben; sie sind dann Teil der Attacke, nicht ihre Ursache.'],
  'Nach dem Kopfschmerz bin ich noch bis zu einem Tag erschöpft, benommen oder unkonzentriert, wie verkatert.',
  ['Wortfindung, Gedächtnis oder Konzentration sind rund um die Attacken spürbar schlechter.','Kann ADHS-Merkmalen ähneln. Bessern sie sich mit wirksamer Migränebehandlung, gehörten sie zur Migräne.'],
  ['Während der Attacke ist die Haut berührungsempfindlich, z. B. beim Kämmen, durch Brille, Kopfkissen oder Kleidung.','Allodynie: Zeichen einer zentralen Sensibilisierung und Risikofaktor für Chronifizierung. Mit der ASC-12 unten messbar.'],
  ['Gerüche sind während der Attacke unangenehm oder kaum auszuhalten.','Geruchsempfindlichkeit spricht deutlich für Migräne und gegen Spannungskopfschmerz.'],
  'Ruhe in einem dunklen, stillen Raum oder Schlaf lindert deutlich.',
  ['Während der Attacken habe ich Schwindel.','Bei wiederkehrendem Schwindel an vestibuläre Migräne denken; siehe auch Reiter Ataxie Typ 2.'],
  ['Manchmal kommen Attacken ganz ohne Kopfschmerz, z. B. nur mit Schwindel, Übelkeit oder Sehstörungen.','Möglich bei Aura ohne Kopfschmerz und bei vestibulärer Migräne.'],
  ['Beim Autofahren oder auf Schiffen wird mir schnell übel, oft schon seit der Kindheit.','Reisekrankheit ist bei Menschen mit Migräne deutlich häufiger, oft schon im Kindesalter.'],
  ['Eltern oder Geschwister haben Migräne.','Migräne ist stark erblich.'],
  ['Die ersten Attacken hatte ich in Kindheit oder Jugend.','Migräne beginnt meist vor dem 30. Lebensjahr. Ein neuer Kopfschmerz ab 50 gehört ärztlich abgeklärt.']]},
 'mig-ausloeser': {title:'Was löst Kopfschmerzen aus oder verstärkt sie?', rule:'Alles abhaken, was zutrifft; zählt nicht für die Diagnose', items:[
  ['Stress, auch das Nachlassen von Stress, z. B. am Wochenende oder im Urlaub.','Der am häufigsten genannte Auslöser.'],
  ['Reizüberflutung durch Licht, Flackern oder Bildschirme.','Lichtempfindlichkeit kann auch schon zur Vorphase gehören.'],
  'Reizüberflutung durch Lärm, viele Stimmen oder volle Räume.',
  'Gerüche, Rauch oder Parfum.',
  'Zu wenig, zu viel oder unregelmäßiger Schlaf.',
  'Ausgelassene Mahlzeiten, Unterzucker oder zu wenig getrunken.',
  'Wetterwechsel.',
  'Alkohol.',
  ['Koffein: zu viel oder weniger als gewohnt, z. B. später Kaffee am Wochenende.','Auch der Koffeinentzug kann Kopfschmerzen auslösen.'],
  'Hormonelle Schwankungen, z. B. rund um die Menstruation.',
  ['Kognitive Überlastung, z. B. lange konzentrierte Arbeit oder viele Aufgaben gleichzeitig.','Von neurodivergenten Menschen oft berichtet; in Studien meist unter Stress erfasst.'],
  ['Lange soziale Situationen oder Masking.','Von autistischen Menschen häufig berichtet; als Migräneauslöser bisher kaum eigens untersucht.'],
  ['Starke körperliche Anstrengung.','Kann eine Attacke auslösen; regelmäßiger, moderater Ausdauersport wirkt dagegen vorbeugend.']]},
 'mig-tth': {title:'Spannungskopfschmerz · Schmerz', rule:'Kriterium nach ICHD-3: mindestens 2 von 4', min:2, items:[
  'Der Schmerz ist drückend oder ziehend, wie ein enges Band oder ein Schraubstock, nicht pulsierend.',
  'Er sitzt auf beiden Seiten.',
  'Er ist leicht bis mittel; meinen Alltag kann ich weitgehend fortsetzen.',
  'Treppensteigen oder Gehen verstärkt ihn nicht.']},
 'mig-tth-b': {title:'Spannungskopfschmerz · Begleitsymptome', rule:'Beide müssen zutreffen', all:true, items:[
  'Dabei ist mir nicht übel.',
  'Höchstens eines von beiden stört mich dabei stärker: Licht oder Lärm.']},

 'da-stimme': {title:'Atmung und Stimme', items:[
  'Meine Stimme ist leise geworden und wird zum Satzende hin leiser.',
  ['Meine Stimme klingt monotoner als früher, die Betonung ist verloren gegangen.','Gemeint ist eine Veränderung. Eine schon immer ungewöhnliche Sprachmelodie gehört zu „Sprechen seit der Kindheit“ weiter unten.'],
  'Meine Stimme klingt gepresst, angestrengt oder rau.',
  'Meine Stimme klingt behaucht, heiser oder schwach.',
  'Beim Sprechen geht mir die Luft aus; ich schaffe nur kurze Sätze pro Atemzug.']},
 'da-artik': {title:'Artikulation und Tempo', items:[
  'Laute klingen verwaschen oder undeutlich.',
  'Silben klingen abgehackt und ungleichmäßig betont.',
  'Lautstärke schwankt; meine Sprache klingt „wie betrunken“.',
  'Ich spreche deutlich langsamer als früher.',
  ['Innerhalb eines Satzes werde ich immer schneller und kann das Tempo kaum bremsen. Das war früher nicht so.','So bei Parkinson beschrieben. Schon immer schnelles, überhastetes Sprechen bei Aufregung passt eher zu Poltern (unten).'],
  'Meine Stimme klingt näselnd, Luft entweicht durch die Nase.',
  'Unwillkürliche Bewegungen von Gesicht oder Zunge unterbrechen das Sprechen.']},
 'da-begleit': {title:'Begleitzeichen', items:[
  'Ich habe Schluckbeschwerden oder verschlucke mich häufig.',
  'Andere verstehen mich schlechter und fragen öfter nach.',
  'Gleichzeitig habe ich Gang- oder Gleichgewichtsprobleme.',
  'Gleichzeitig sind meine Bewegungen verlangsamt oder ich zittere in Ruhe.']},
 'da-entw': {title:'Sprechen seit der Kindheit', rule:'Keine Dysarthrie-Merkmale; dienen der Abgrenzung zu Autismus, ADHS und Dyspraxie', items:[
  ['Meine Sprachmelodie wirkt auf andere ungewöhnlich, z. B. monoton, singend, zu förmlich oder falsch betont, obwohl ich die Laute deutlich bilde. Das ist schon immer so.','Bei Autismus gut belegt (Prosodie). Überschneidet sich mit der Frage zu Tonfall und Mimik im Reiter Autismus.'],
  ['Einzelne Laute bilde ich seit der Kindheit ungenau, z. B. ein gelispeltes s oder ein ungewöhnliches r.','Bei autistischen Jugendlichen und Erwachsenen häufiger als bei anderen.'],
  ['Wenn ich aufgeregt bin oder viel sagen will, spreche ich sehr schnell; Silben gehen verloren, ich verhasple mich oder setze neu an.','Typisch für Poltern, eine Redeflussstörung, die bei ADHS gehäuft vorkommt.'],
  ['Lange oder schwierige Wörter und schnelle Lautfolgen kosten mich Mühe; ich muss sie bewusst planen.','Kann auf eine weniger präzise Sprechmotorik hinweisen, wie sie bei Dyspraxie (UEMF) beschrieben ist.'],
  ['Bei Überlastung kann ich zeitweise kaum oder gar nicht sprechen, obwohl ich es möchte.','Von vielen Autist:innen beschrieben (situativer Mutismus, Shutdown); systematische Studien sind noch selten.']]}
};
export const DA_ENTW = ['Sprachmelodie (Autismus)','Laute seit der Kindheit ungenau','Poltern (ADHS)','Sprechmotorik (Dyspraxie)','Sprechen fällt unter Überlastung aus (Autismus)'];

export const R = {
 'bip-dauer': {title:'Wie lange dauerte die Hochphase am Stück?', opts:['1 bis 3 Tage','4 bis 6 Tage','7 Tage oder länger','Kürzer als einen Tag: kommt und geht, oft mehrmals am Tag'], order:[3,0,1,2]},
 'bip-schwere': {title:'Wie stark waren die Folgen?', opts:['Anderen fiel die Veränderung auf, Arbeit und Alltag liefen aber weiter.','Deutliche Probleme in Arbeit, Beziehungen oder Finanzen, Klinikaufenthalt oder Realitätsverlust.']},
 'ea-dauer': {title:'Wie lange dauert die eigentliche Attacke, bis Drehschwindel und starke Unsicherheit abklingen?', opts:['Sekunden bis etwa 1 Minute','Wenige Minuten (unter 5)','5 Minuten bis einige Stunden','Stunden bis Tage']},
 'mig-tage': {title:'An wie vielen Tagen im Monat hast du Kopfschmerzen?', opts:['Seltener als an 1 Tag','An 1 bis 7 Tagen','An 8 bis 14 Tagen','An 15 oder mehr Tagen','Täglich']},
 'mig-dauer': {title:'Wie lange dauert der Kopfschmerz ohne wirksame Behandlung?', opts:['Unter 30 Minuten','30 Minuten bis 4 Stunden','4 bis 72 Stunden','Länger als 72 Stunden am Stück','Durchgehend, ohne abgrenzbare Attacken']},
 'mig-ort': {title:'Wo sitzt der Schmerz meistens?', opts:['Auf einer Seite','Beidseitig an Stirn oder Schläfen','Tief in der Kopfmitte oder am Scheitel','Am Hinterkopf','Am ganzen Kopf, wie ein Band oder Helm','Streng einseitig hinter oder um ein Auge']},
 'dep-tagesverlauf': {title:'Wie verlaufen die Beschwerden über den Tag?', opts:['Durchgehend: fast den ganzen Tag gleich gedrückt','Wechselnd: mehrmals am Tag mal gut, mal schlecht, oft je nach Situation','Morgens am schlimmsten, im Lauf des Tages etwas besser','Abends schlechter als morgens']},
 'da-verlauf': {title:'Wie hat die Sprechstörung begonnen?', opts:['Plötzlich, innerhalb von Minuten bis Tagen','Schleichend über Monate oder Jahre','Nur phasenweise, z. B. anfallsartig oder bei Müdigkeit','Schon seit der Kindheit']}
};

export const DA_TAGS = {
 'da-stimme.0':['hypokinetisch'],'da-stimme.1':['hypokinetisch','spastisch'],'da-stimme.2':['spastisch'],'da-stimme.3':['schlaff'],'da-stimme.4':['schlaff'],
 'da-artik.0':[],'da-artik.1':['ataktisch'],'da-artik.2':['ataktisch'],'da-artik.3':['spastisch'],'da-artik.4':['hypokinetisch'],'da-artik.5':['schlaff'],'da-artik.6':['hyperkinetisch'],
 'da-begleit.2':['ataktisch'],'da-begleit.3':['hypokinetisch']
};
export const DIFF_TAGS = ['adhs','adhs','adhs','adhs','dep','dep','dep','dep','bip','bip','bip','bip'];

/* ---------- Tests ---------- */
export const T = {
 asrs: {
  title:'ASRS-v1.1 Screener (ADHS, Erwachsene)',
  intro:'Originalwortlaut, unverändert (Lizenzbedingung). Die offizielle deutsche Fassung gibt es als PDF bei Harvard NCS. Zeitraum: letzte 6 Monate.',
  instr:'Check the box that best describes how you have felt and conducted yourself over the past 6 months.',
  opts:[['Never',0],['Rarely',1],['Sometimes',2],['Often',3],['Very Often',4]],
  items:[
   'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?',
   'How often do you have difficulty getting things in order when you have to do a task that requires organization?',
   'How often do you have problems remembering appointments or obligations?',
   'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?',
   'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?',
   'How often do you feel overly active and compelled to do things, like you were driven by a motor?'],
  shade:(i,v)=> i<3 ? v>=2 : v>=3,
  copy:'Adult ADHD Self-Report Scale (ASRS-v1.1) Screener. © New York University and President and Fellows of Harvard College. All rights reserved. Kessler RC et al. (2005): The World Health Organization Adult ADHD Self-Report Scale (ASRS). Psychological Medicine 35(2), 245–256.',
  link:['Offizielle deutsche Fassung (PDF)','https://www.hcp.med.harvard.edu/ncs/ftpdir/adhd/6Q_German_final.pdf']
 },
 phq: {
  title:'PHQ-9 · Gesundheitsfragebogen für Patienten (Depression)',
  intro:'Deutsche Originalfassung. Zeitraum: letzte 2 Wochen. Gezählt werden Tage, an denen eine Beschwerde vorkam, nicht wie lange sie am Tag anhielt.',
  instr:'Wie oft fühlten Sie sich im Verlauf der letzten 2 Wochen durch die folgenden Beschwerden beeinträchtigt?',
  opts:[['Überhaupt nicht',0],['An einzelnen Tagen',1],['An mehr als der Hälfte der Tage',2],['Beinahe jeden Tag',3]],
  items:[
   'Wenig Interesse oder Freude an Ihren Tätigkeiten',
   'Niedergeschlagenheit, Schwermut oder Hoffnungslosigkeit',
   'Schwierigkeiten ein- oder durchzuschlafen oder vermehrter Schlaf',
   'Müdigkeit oder Gefühl, keine Energie zu haben',
   'Verminderter Appetit oder übermäßiges Bedürfnis zu essen',
   'Schlechte Meinung von sich selbst; Gefühl, ein Versager zu sein oder die Familie enttäuscht zu haben',
   'Schwierigkeiten, sich auf etwas zu konzentrieren, z. B. beim Zeitunglesen oder Fernsehen',
   'Waren Ihre Bewegungen oder Ihre Sprache so verlangsamt, dass es auch anderen auffallen würde? Oder waren Sie im Gegenteil „zappelig“ oder ruhelos und hatten dadurch einen stärkeren Bewegungsdrang als sonst?',
   'Gedanken, dass Sie lieber tot wären oder sich Leid zufügen möchten'],
  extra:{q:'Wenn eine oder mehrere der Beschwerden bei Ihnen vorliegen, geben Sie bitte an, wie sehr diese Probleme es Ihnen erschwert haben, Ihre Arbeit zu erledigen, Ihren Haushalt zu regeln oder mit anderen Menschen zurecht zu kommen:', opts:['Überhaupt nicht erschwert','Etwas erschwert','Relativ stark erschwert','Sehr stark erschwert']},
  copy:'Englische Version: Patient Health Questionnaire-9 (PHQ-9), Spitzer, Kroenke & Williams (1999). Deutsche Version: © Prof. Dr. Bernd Löwe, Universitätsklinikum Hamburg-Eppendorf.'
 },
 who5: {
  title:'WHO-5 · Fragebogen zum Wohlbefinden',
  intro:'Deutsche Originalfassung (Version 1998). Zeitraum: letzte 2 Wochen.',
  instr:'Die folgenden Aussagen betreffen Ihr Wohlbefinden in den letzten zwei Wochen. In den letzten zwei Wochen …',
  opts:[['Die ganze Zeit',5],['Meistens',4],['Etwas mehr als die Hälfte der Zeit',3],['Etwas weniger als die Hälfte der Zeit',2],['Ab und zu',1],['Zu keinem Zeitpunkt',0]],
  items:['… war ich froh und guter Laune','… habe ich mich ruhig und entspannt gefühlt','… habe ich mich energisch und aktiv gefühlt','… habe ich mich beim Aufwachen frisch und ausgeruht gefühlt','… war mein Alltag voller Dinge, die mich interessieren'],
  copy:'WHO (Fünf) – Fragebogen zum Wohlbefinden (Version 1998). © Psychiatric Research Unit, WHO Collaborating Center for Mental Health, Frederiksborg General Hospital, DK-3400 Hillerød.'
 }
};

/* ---------- Externe Tests ---------- */
export const XAREAS=['adhs','autismus','depression','bipolar','alexithymie','migraene','dyskalkulie','dyspraxie'];
export const CLS_LABEL=['unauffällig','grenzwertig','auffällig'], CLS_LV=['low','partial','match'], CLS_OPTS=['Unauffällig','Grenzwertig','Auffällig'];
export const MDQ_P=['keine','leichte','mittlere','schwere'];
export const XT = {
 wursk:{area:'adhs', name:'WURS-K', what:'ADHS-Merkmale in der Kindheit, rückblickend', min:0, max:84, rule:'ab 30 Punkten auffällig', cls:v=>v>=30?2:0, note:'Die deutsche Kurzform ist lizenzpflichtig und nur über eine Fachpraxis erhältlich. Kostenlos ist das englische Original (WURS-25, nächste Zeile).'},
 wurs25:{area:'adhs', name:'WURS-25 (englisches Original)', what:'ADHS-Merkmale in der Kindheit, rückblickend', min:0, max:100, rule:'ab 46 Punkten auffällig', cls:v=>v>=46?2:0, links:[['https://northyorkshireccg.nhs.uk/wp-content/uploads/2021/05/wender_utah_rating_scale-short-version.pdf','NHS North Yorkshire (PDF mit Auswertung, englisch)']]},
 caars:{area:'adhs', name:'CAARS, ADHS-Index', what:'Selbstbeurteilung für Erwachsene', min:0, max:120, unit:'T', rule:'ab T 65 auffällig, 60–64 grenzwertig', cls:v=>v>=65?2:v>=60?1:0, note:'Kostenpflichtig und nur über eine Fachpraxis erhältlich.'},
 diva:{area:'adhs', name:'DIVA-5', what:'Strukturiertes Interview durch eine Fachperson', manual:true, opts:['Kriterien nicht erfüllt','Teilweise erfüllt','Kriterien erfüllt'], note:'Wird von einer Fachperson im Gespräch durchgeführt.'},
 aq10:{area:'autismus', name:'AQ-10', what:'Kurzscreening', min:0, max:10, rule:'ab 6 Punkten Abklärung erwägen', cls:v=>v>=6?2:0, links:[['https://embrace-autism.com/aq-10/','Embrace Autism (online, englisch)']]},
 aq50:{area:'autismus', name:'AQ (50 Fragen)', what:'Autismus-Spektrum-Quotient', min:0, max:50, rule:'ab 32 deutlich erhöht, 26–31 grenzwertig', cls:v=>v>=32?2:v>=26?1:0, links:[['https://docs.autismresearchcentre.com/tests/AQ_Adult_German.pdf','Autism Research Centre Cambridge (PDF mit Auswertung, deutsch)'],['https://embrace-autism.com/autism-spectrum-quotient/','Embrace Autism (online, englisch)']]},
 raadsr:{area:'autismus', name:'RAADS-R', what:'Erwachsene, 80 Aussagen', min:0, max:240, rule:'ab 65 Punkten vereinbar mit Autismus', cls:v=>v>=65?2:0,
  subs:[{id:'sr',name:'Soziale Bezogenheit',max:117,th:31},{id:'ci',name:'Spezialinteressen',max:42,th:15},{id:'la',name:'Sprache',max:21,th:4},{id:'sm',name:'Sensorik und Motorik',max:60,th:16}], links:[['https://embrace-autism.com/raads-r/','Embrace Autism (online, englisch)']]},
 catq:{area:'autismus', name:'CAT-Q', what:'Masking / Camouflaging', min:25, max:175, rule:'kein offizieller Schwellenwert; eingestuft wird über den Mittelwert pro Frage: ab 120 Punkten (Ø 4,8, Mittel autistischer Erwachsener) auffällig, 88–119 grenzwertig, bis 87 (Ø 3,5, Mittel nicht-autistischer Erwachsener) unauffällig', cls:v=>v>=120?2:v>87.5?1:0,
  perItem:{n:25, ref:'Vergleich Hull et al. 2019: autistische Erwachsene 4,8, nicht-autistische 3,5', pos:['Das liegt auf oder unter dem Mittel nicht-autistischer Erwachsener, daher unauffällig.','Das liegt zwischen beiden Mittelwerten, daher grenzwertig.','Das liegt auf oder über dem Mittel autistischer Erwachsener, daher auffällig.']},
  subs:[{id:'co',name:'Kompensation',min:9,max:63,n:9,ref:'autistisch 4,4, nicht-autistisch 2,9'},{id:'ma',name:'Maskieren',min:8,max:56,n:8,ref:'autistisch 4,6, nicht-autistisch 4,3'},{id:'as',name:'Assimilation',min:8,max:56,n:8,ref:'autistisch 5,3, nicht-autistisch 3,3'}],
  subsNote:'Ø = Mittelwert pro Frage auf der Skala 1–7. Die Unterskala Maskieren unterscheidet in der Validierungsstudie kaum zwischen autistischen und nicht-autistischen Erwachsenen. Der CAT-Q misst Camouflaging, nicht Autismus, und ist nicht für die Diagnose gedacht.', links:[['https://embrace-autism.com/cat-q/','Embrace Autism (online, englisch)']]},
 eq:{area:'autismus', name:'EQ', what:'Empathie-Quotient', min:0, max:80, rule:'bis 30 Punkte auffällig niedrig', cls:v=>v<=30?2:0, hedge:{n:40}, links:[['https://embrace-autism.com/empathy-quotient/','Embrace Autism (online, englisch)']]},
 bdi2:{area:'depression', name:'BDI-II', what:'Beck-Depressions-Inventar', min:0, max:63, rule:'0–13 minimal, 14–19 leicht, 20–28 mittelgradig, ab 29 schwer', cls:v=>v>=20?2:v>=14?1:0, note:'Kostenpflichtig und nur über eine Fachpraxis erhältlich. Kostenlos und hier eingebaut sind PHQ-9 und WHO-5.'},
 mdq:{area:'bipolar', name:'MDQ', what:'Mood Disorder Questionnaire', special:'mdq', rule:'positiv bei mindestens 7 × Ja, gleichzeitig aufgetreten und mindestens mittleren Problemen', links:[['https://www.mdcalc.com/calc/10671/mood-disorder-questionnaire-mdq','MDCalc (online, englisch)']]},
 hcl32:{area:'bipolar', name:'HCL-32', what:'Hypomanie-Checkliste', min:0, max:32, rule:'ab 14 Ja-Antworten auffällig', cls:v=>v>=14?2:0, links:[['https://chai-prod-sabi.bioinf.unc.edu/pdf/Hypomania%20Checklist_Angst.pdf','University of North Carolina (PDF, englisch; Ja-Antworten zählen)']]},
 tas20:{area:'alexithymie', name:'TAS-20', what:'Toronto-Alexithymie-Skala', min:20, max:100, rule:'bis 51 unauffällig, 52–60 grenzwertig, ab 61 alexithym', cls:v=>v>=61?2:v>=52?1:0,
  subs:[{id:'dif',name:'Gefühle erkennen',min:7,max:35},{id:'ddf',name:'Gefühle beschreiben',min:5,max:25},{id:'eot',name:'Außenorientiertes Denken',min:8,max:40}], links:[['https://embrace-autism.com/toronto-alexithymia-scale/','Embrace Autism (online, englisch)']]},
 paq:{area:'alexithymie', name:'PAQ', what:'Perth Alexithymia Questionnaire', min:24, max:168, rule:'Normbereiche: bis 51 niedrig, 52–112 durchschnittlich, ab 113 hoch (auffällig)', cls:v=>v>=113?2:0,
  subs:[{id:'dif',name:'Gefühle erkennen',min:8,max:56},{id:'ddf',name:'Gefühle beschreiben',min:8,max:56},{id:'eot',name:'Außenorientiertes Denken',min:8,max:56}],
  subsNote:'Gefühle erkennen und Gefühle beschreiben bestehen je zur Hälfte aus Fragen zu unangenehmen und zu angenehmen Gefühlen.',
  bands:{list:[[51,'niedrig','24–51'],[112,'durchschnittlich','52–112'],[168,'hoch','113–168']], ref:'Normstichprobe: 748 australische Erwachsene, Mittelwert 82, Standardabweichung 31; „hoch“ heißt mehr als eine Standardabweichung über dem Mittel. Nach Geschlecht getrennt beginnt „hoch“ bei Männern ab 112, bei Frauen ab 114.'}, links:[['https://embrace-autism.com/perth-alexithymia-questionnaire/','Embrace Autism (online, englisch); Normwerte auf der Seite']]},
 idmig:{area:'migraene', name:'ID Migraine', what:'Kurzscreening, 3 Ja/Nein-Fragen zu den letzten 3 Monaten: Einschränkung an mindestens einem Tag, Übelkeit, Lichtempfindlichkeit', min:0, max:3, rule:'ab 2 Ja-Antworten positiv', cls:v=>v>=2?2:0, links:[['https://www.aafp.org/pubs/afp/issues/2006/1215/p2087.html','AAFP (Fragen und Auswertung, englisch)']]},
 midas:{area:'migraene', name:'MIDAS', what:'Beeinträchtigung durch Kopfschmerzen, 5 Fragen zu den letzten 3 Monaten (Tage)', min:0, max:270, rule:'Grad I 0–5, II 6–10, III 11–20, IV ab 21', cls:v=>v>=11?2:v>=6?1:0,
  bands:{label:'Einstufung', list:[[5,'Grad I, keine oder geringe Beeinträchtigung','0–5'],[10,'Grad II, leichte Beeinträchtigung','6–10'],[20,'Grad III, mäßige Beeinträchtigung','11–20'],[270,'Grad IV, schwere Beeinträchtigung','21–270']], ref:'MIDAS misst die Beeinträchtigung, nicht die Kopfschmerzart.'}, links:[['https://neurologie.meduniwien.ac.at/fileadmin/content/OE/neurologie/dokumente/MIDAS.pdf','MedUni Wien (PDF, deutsch)']]},
 hit6:{area:'migraene', name:'HIT-6', what:'Auswirkung von Kopfschmerzen auf den Alltag, 6 Fragen', min:36, max:78, rule:'bis 49 kaum, 50–55 etwas, 56–59 deutlich, ab 60 schwere Auswirkung', cls:v=>v>=60?2:v>=56?1:0,
  bands:{label:'Einstufung', list:[[49,'kaum oder keine Auswirkung','36–49'],[55,'etwas Auswirkung','50–55'],[59,'deutliche Auswirkung','56–59'],[78,'schwere Auswirkung','60–78']], ref:'HIT-6 misst die Auswirkung, nicht die Kopfschmerzart.'}, note:'Lizenzpflichtig (QualityMetric); erhältlich über Fachpraxen und manche Kopfschmerz-Apps.'},
 asc12:{area:'migraene', name:'ASC-12', what:'Allodynie-Checkliste: Berührungsempfindlichkeit der Haut während der Attacke, 12 Fragen', min:0, max:24, rule:'0–2 keine, 3–5 leichte, 6–8 mittlere, ab 9 schwere Allodynie', cls:v=>v>=9?2:v>=3?1:0,
  bands:{label:'Einstufung', list:[[2,'keine Allodynie','0–2'],[5,'leichte Allodynie','3–5'],[8,'mittlere Allodynie','6–8'],[24,'schwere Allodynie','9–24']], ref:'Allodynie ist ein Zeichen zentraler Sensibilisierung und ein Risikofaktor für Chronifizierung.'}, links:[['https://headaches.org/wp-content/uploads/2025/06/ASC-12-Allodynia-Checklist.pdf','National Headache Foundation (PDF, englisch)']]},
 rechentest:{area:'dyskalkulie', name:'Normierter Rechentest', what:'z. B. ZAREKI-R, DEMAT, HRT', min:0, max:100, unit:'PR', rule:'bis PR 16 auffällig, 17–25 grenzwertig', cls:v=>v<=16?2:v<=25?1:0, note:'Normierte Rechentests gibt es nur über eine Fachpraxis oder Lerntherapie.'},
 mabc2:{area:'dyspraxie', name:'MABC-2', what:'Motoriktest, Gesamtwert', min:0, max:100, unit:'PR', rule:'bis PR 5 deutlich, 6–15 Risikobereich', cls:v=>v<=5?2:v<=15?1:0, note:'Motoriktest in einer Ergotherapie- oder Fachpraxis.'},
 adc:{area:'dyspraxie', name:'ADC', what:'Checkliste für Erwachsene', min:0, max:123, rule:'Nie 0, Manchmal 1, Oft 2, Immer 3 Punkte; 56–64 Risikobereich, ab 65 wahrscheinliche UEMF', cls:v=>v>=65?2:v>=56?1:0, links:[['https://chap.haifa.ac.il/wp-content/uploads/2025/06/ADC-German_Checkliste-fur-Entwicklungsbedingte-Koordinationsstorung.pdf','Universität Haifa (PDF, deutsch)']]},
};
export const TSHORT={asrs:'ASRS-v1.1', phq:'PHQ-9', who5:'WHO-5'};


/* ---------- Beschreibungen der Fragebogen-Karten ---------- */
export const XDESC={"adhs": "Der ASRS-v1.1 Screener der Weltgesundheitsorganisation ist hier eingebaut. Die Wender Utah Rating Scale erfasst rückblickend ADHS-Merkmale in der Kindheit: Die deutsche Kurzform WURS-K ist lizenzpflichtig, das englische Original WURS-25 kostenlos. CAARS und DIVA-5 gibt es nur über eine Fachpraxis. Details unter <a href=\"#tests\">Alle Tests</a>.", "autismus": "AQ-10 (Kurzscreening, Abklärung ab 6 von 10 Punkten erwägen), AQ mit 50 Fragen, RAADS-R für Erwachsene, CAT-Q zum Masking und EQ (Empathie-Quotient). Die Tests des Autism Research Centre (AQ, EQ) dürfen nur unverändert und nicht kommerziell genutzt werden; deshalb sind sie hier verlinkt statt eingebaut. Details unter <a href=\"#tests\">Alle Tests</a>.", "depression": "PHQ-9 (depressive Beschwerden der letzten zwei Wochen) und WHO-5 (Wohlbefinden der letzten zwei Wochen) sind hier eingebaut. Das Beck-Depressions-Inventar (BDI-II) ist kostenpflichtig und nur über eine Fachpraxis erhältlich. Details unter <a href=\"#tests\">Alle Tests</a>.", "bipolar": "MDQ (Mood Disorder Questionnaire) und HCL-32 (Hypomanie-Checkliste) sind etablierte Screenings; Auswertung unter <a href=\"#tests\">Alle Tests</a>. Sehr hilfreich ist ein Stimmungstagebuch über mehrere Wochen mit Schlafdauer, Stimmung und Energie, z.&nbsp;B. das der Deutschen Gesellschaft für Bipolare Störungen.", "alexithymie": "TAS-20 (Toronto-Alexithymie-Skala; ab 61 Punkten alexithym, 52–60 grenzwertig), die deutsche TAS-26, der Perth Alexithymia Questionnaire (PAQ) mit getrennten Werten für positive und negative Gefühle sowie der BVAQ. Die Checkliste oben ist nicht validiert und ersetzt diese Fragebögen nicht.", "dyskalkulie": "Einen frei verfügbaren, normierten Selbsttest gibt es nicht. Normierte Rechentests führen Fachpraxen oder Lerntherapien durch, bei Kindern z.&nbsp;B. ZAREKI-R, DEMAT oder HRT, bei Erwachsenen im Rahmen einer neuropsychologischen Diagnostik. Eingetragen wird der Prozentrang aus dem Testergebnis.", "dyspraxie": "Die Adult DCD/Dyspraxia Checklist (ADC) für Erwachsene gibt es kostenlos auf Deutsch zum Selbstausfüllen. Der Motoriktest MABC-2 wird in einer Ergotherapie- oder Fachpraxis durchgeführt; eingetragen wird der Prozentrang des Gesamtwerts. Details unter <a href=\"#tests\">Alle Tests</a>.", "migraene": "ID Migraine ist ein Kurzscreening mit drei Fragen. MIDAS und HIT-6 messen, wie stark Kopfschmerzen den Alltag beeinträchtigen, nicht welche Art vorliegt; Kopfschmerzambulanzen nutzen sie für den Verlauf und die Entscheidung über eine Vorbeugung. Die ASC-12 erfasst die Berührungsempfindlichkeit der Haut während der Attacke. Wichtigstes Werkzeug bleibt der Kopfschmerzkalender."};
