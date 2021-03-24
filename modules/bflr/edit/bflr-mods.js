import KuberamMultiselectComponent from "/modules/kuberam-multiselect/kuberam-multiselect.js";
import Sortable from "/modules/sortable/sortable.esm.js";

teian.dataInstances.roles = [
    ["adaptator", "adapter"],
    ["adnotator", "annotator"],
    ["alcătuitor de glosar", "alcătuitor de glosar"],
    ["alcătuitor de indice", "alcătuitor de indice"],
    ["alcătuitor de indice și glosar", "alcătuitor de indice și glosar"],
    ["antologator", "antologator"],
    ["autor", "author"],
    ["colaborator", "colaborator"],
    ["colaborator principal", "colaborator principal"],
    ["conducător", "director"],
    ["conducătorul lucrării", "conducătorul lucrării"],
    ["coordonator", "coordonator"],
    ["coordonator colecție", "coordonator colecție"],
    ["coordonator general", "coordonator general"],
    ["coordonator principal", "coordonator principal"],
    ["coordonator științific", "coordonator științific"],
    ["copist", "copist"],
    ["culegător", "culegător"],
    ["director", "director"],
    ["director fondator", "director fondator"],
    ["editor", "editor"],
    ["editor coordonator", "editor coordonator"],
    ["editor responsabil", "editor responsabil"],
    ["editor științific", "editor științific"],
    ["editorul colecției", "editorul colecției"],
    ["fondator", "fondator"],
    ["grafician", "illustrator"],
    ["ilustrator", "illustrator"],
    ["inițiatorul ediției", "inițiatorul ediției"],
    ["membru", "membru"],
    ["postfațator", "postfațator"],
    ["prefațator", "prefațator"],
    ["proprietar", "owner"],
    ["redactor", "redaktor"],
    ["redactor coordonator", "redactor coordonator"],
    ["redactor principal", "redactor principal"],
    ["redactor responsabil", "redactor responsabil"],
    ["redactor responsabil adjunct", "redactor responsabil adjunct"],
    ["redactor-șef", "redactor-șef"],
    ["revizor", "reviewer"],
    ["secretar", "secretary"],
    ["secretar științific", "secretar științific"],
    ["subdirector", "subdirector"],
    ["supraveghetorul ediției", "supraveghetorul ediției"],
    ["tipograf", "typographer"],
    ["traducător", "translator"]
];

const genres = [
	["studiu de gramatică", "studiu de gramatică"],
	["dicționar", "dicționar"],
	["vocabular", "vocabular"],
	["enciclopedie", "enciclopedie"],
	["roman", "roman"],
	["manual", "manual"],
	["cotidian", "cotidian"],
	["supliment săptămânal", "supliment săptămânal"],
	["gazetă", "gazetă"],
	["revistă săptămânală", "revistă săptămânală"],
	["povestiri și nuvele", "povestiri și nuvele"],
	["schițe și povestiri", "schițe și povestiri"],
	["jurnal de agricultură și economia rurală", "jurnal de agricultură și economia rurală"],
	["gazetă politico-literară", "gazetă politico-literară"],
	["comedie", "comedie"],
	["cânticel comic", "cânticel comic"],
	["vodevil", "vodevil"],
	["dramă istorică", "dramă istorică"],
	["farsă de carnaval", "farsă de carnaval"],
	["operetă", "operetă"],
	["comedie într-un act", "comedie într-un act"],
	["legendă istorică", "legendă istorică"],
	["poezii", "poezii"],
	["piesă", "piesă"],
	["operetă comică", "operetă comică"],
	["dramă", "dramă"],
	["Comedie", "Comedie"],
	["dcenetă", "dcenetă"],
	["proză", "proză"],
	["feerie", "feerie"],
	["scenă în versuri", "scenă în versuri"],
	["tragedie", "tragedie"],
	["însemnări de călătorie", "însemnări de călătorie"],
	["poem", "poem"],
	["poezii, fabule", "poezii, fabule"],
	["carte populară", "carte populară"],
	["folclor", "folclor"],
	["publicație periodică", "publicație periodică"],
	["povestiri", "povestiri"],
	["atlas lingvistic", "atlas lingvistic"],
	["cronică", "cronică"],
	["condică", "condică"],
	["roman științifico-fantastic", "roman științifico-fantastic"],
	["revistă", "revistă"],
	["studiu", "studiu"],
	["roman", "roman"],
	["text religios", "text religios"],
	["predici", "predici"],
	["text de lege", "text de lege"],
	["document", "document"],
	["Foaie volantă", "Foaie volantă"],
	["versuri", "versuri"],
	["poem în proză", "poem în proză"],
	["poeme în proză", "poeme în proză"],
	["poeme", "poeme"],
	["publicație", "publicație"],
	["studiu istoric", "studiu istoric"],
	["stanțe epice", "stanțe epice"],
	["studiu etimologic", "studiu etimologic"],
	["studiu filologic", "studiu filologic"],
	["fabule", "fabule"],
	["pastorală", "pastorală"],
	["tragedie lirică", "tragedie lirică"],
	["comedie-vodevil", "comedie-vodevil"],
	["text juridic", "text juridic"],
	["teatru", "teatru"],
	["poem biblic", "poem biblic"],
	["atlas", "atlas"],
	["tratat de medicină", "tratat de medicină"],
	["studii", "studii"],
	["publicistică", "publicistică"],
	["amintiri", "amintiri"],
	["pasteluri", "pasteluri"],
	["proză; poezii", "proză; poezii"],
	["nuvele", "nuvele"],
	["reportaje", "reportaje"],
	["critică literară", "critică literară"],
	["studii istorice", "studii istorice"],
	["schițe", "schițe"],
	["nuvele și schițe umoristice", "nuvele și schițe umoristice"],
	["studiu etnozoologic, zoogeografic și bioeconomic", "studiu etnozoologic, zoogeografic și bioeconomic"],
	["studiu filosofic", "studiu filosofic"],
	["tempi passati", "tempi passati"],
	["curs de crept civil", "curs de crept civil"],
	["studii literare", "studii literare"],
	["studiu juridic", "studiu juridic"],
	["studiu despre artă", "studiu despre artă"],
	["studiu etnografic ?", "studiu etnografic ?"],
	["memorialistică", "memorialistică"],
	["pantomimă", "pantomimă"],
	["studii filosofice", "studii filosofice"],
	["mister păgân", "mister păgân"],
	["proză scurtă", "proză scurtă"],
	["interviuri", "interviuri"],
	["discurs", "discurs"],
	["studiu filologic, istoric și cultural", "studiu filologic, istoric și cultural"],
	["glosar", "glosar"],
	["studiu de retorică", "studiu de retorică"],
	["povestiri ?", "povestiri ?"],
	["pagini literare și publicistică", "pagini literare și publicistică"],
	["reportaje, pamflete, articole", "reportaje, pamflete, articole"],
	["satire politice", "satire politice"],
	["studii de arheologie", "studii de arheologie"],
	["povești", "povești"],
	["studiu lingvistic", "studiu lingvistic"],
	["schițe, nuvele", "schițe, nuvele"],
	["monografie", "monografie"],
	["bibliografie", "bibliografie"],
	["carte de bucate", "carte de bucate"],
	["eseuri", "eseuri"],
	["Studiu de terminologie", "Studiu de terminologie"],
	["Studiu etnografic", "Studiu etnografic"],
	["Jurnal. Interviuri", "Jurnal. Interviuri"],
	["tratat de teologie", "tratat de teologie"],
	["curs de economie", "curs de economie"],
	["curs de istorie naturală și botanică", "curs de istorie naturală și botanică"],
	["curs de retorică", "curs de retorică"],
	["poveste", "poveste"],
	["calendar popular", "calendar popular"],
	["Revistă de politici sociale", "Revistă de politici sociale"],
	["studiu etnografic", "studiu etnografic"],
	["povestire", "povestire"],
	["noțiuni de drept constituțional", "noțiuni de drept constituțional"],
	["eseu filosofic", "eseu filosofic"],
	["roman alegoric", "roman alegoric"],
	["săptămânal economic și financiar.", "săptămânal economic și financiar."],
	["monolog", "monolog"],
	["operă bufă", "operă bufă"],
	["instantaneu într-un act", "instantaneu într-un act"],
	["farsă într-un act", "farsă într-un act"],
	["proză literară", "proză literară"],
	["monolog burlesc", "monolog burlesc"],
	["publicistică, proză literară", "publicistică, proză literară"],
	["farsă fantazistă", "farsă fantazistă"],
	["nuvelă", "nuvelă"],
	["studiu de folclor comparat", "studiu de folclor comparat"],
	["schițe și nuvele", "schițe și nuvele"],
	["proză memorialistică", "proză memorialistică"],
	["fragmente de roman", "fragmente de roman"],
	["studii de folclor", "studii de folclor"],
	["monogafie", "monogafie"],
	["studii și conferințe", "studii și conferințe"],
	["studiu literar", "studiu literar"],
	["fiolclor", "fiolclor"],
	["curs universitar", "curs universitar"],
	["chestionar", "chestionar"],
	["studii filologice și lingvistice", "studii filologice și lingvistice"],
	["crestomație", "crestomație"],
	["schițe și amintiri", "schițe și amintiri"],
	["sudiu filosofic", "sudiu filosofic"],
	["cuvântări", "cuvântări"],
	["epistole de călătorie", "epistole de călătorie"],
	["revistă de folclor", "revistă de folclor"],
	["poezii, proză literară", "poezii, proză literară"],
	["jurnal politic și literar", "jurnal politic și literar"],
	["schițe umoristice", "schițe umoristice"],
	["revistă știintifică și literară", "revistă știintifică și literară"],
	["săptămânal politic, social, cultural", "săptămânal politic, social, cultural"],
	["revistă de literatură", "revistă de literatură"],
	["studii lingvistice", "studii lingvistice"],
	["studiu de stilistică", "studiu de stilistică"],
	["cronic", "cronic"],
	["revistă pentru studiul și explicarea limbii", "revistă pentru studiul și explicarea limbii"],
	["cotidian politic", "cotidian politic"],
	["jurnal literar", "jurnal literar"],
	["gazetă politică, administrativă și culturală", "gazetă politică, administrativă și culturală"],
	["gazetă de literatură, industrie, agricultură și noutăți", "gazetă de literatură, industrie, agricultură și noutăți"],
	["studiu de istorie", "studiu de istorie"],
	["studiu de folclor", "studiu de folclor"],
	["nuvele, schițe", "nuvele, schițe"],
	["corespondență", "corespondență"],
	["discursuri", "discursuri"],
	["articole", "articole"],
	["proză literară, articole", "proză literară, articole"],
	["nuvele fantastice", "nuvele fantastice"],
	["istorie literară", "istorie literară"],
	["studii și articole", "studii și articole"],
	["studiu de ortografie", "studiu de ortografie"],
	["studiu, folclor", "studiu, folclor"],
	["manifest patriotic", "manifest patriotic"],
	["manifest antiotoman", "manifest antiotoman"],
	["eseu de epistemologie", "eseu de epistemologie"],
	["studiu economico-sociologic", "studiu economico-sociologic"],
	["documente", "documente"],
	["documente, scrisori", "documente, scrisori"],
	["satire", "satire"],
	["studiu etnografic și lingvistic", "studiu etnografic și lingvistic"],
	["studiu de sintaxă", "studiu de sintaxă"],
	["medicină", "medicină"],
	["studiu de artă", "studiu de artă"],
	["studii de etimologie", "studii de etimologie"],
	["eseuri filosofice", "eseuri filosofice"],
	["fantezie dramatică", "fantezie dramatică"],
	["poem feeric", "poem feeric"],
	["nuvele, schițe, povestiri", "nuvele, schițe, povestiri"],
	["proză fantastică", "proză fantastică"],
	["basme", "basme"],
	["basm în proză", "basm în proză"],
	["abecedar", "abecedar"],
	["piesă de teatru", "piesă de teatru"],
	["comedie tragică", "comedie tragică"],
	["povestire dramatică", "povestire dramatică"],
	["scenariu radiofonic", "scenariu radiofonic"],
	["conferință", "conferință"],
	["studii de lingvistică", "studii de lingvistică"],
	["critică de artă", "critică de artă"],
	["povestiri, legende", "povestiri, legende"],
	["note de călătorie", "note de călătorie"],
	["proză literară și memorialistică", "proză literară și memorialistică"],
	["lexicon", "lexicon"],
	["revistă de cultură", "revistă de cultură"],
	["gramatică", "gramatică"],
	["articole și comunicări", "articole și comunicări"],
	["studiu lingvistic și filologic", "studiu lingvistic și filologic"],
	["proză memorialistică, însemnări de călătorie, aforisme", "proză memorialistică, însemnări de călătorie, aforisme"],
	["proverbe, povești", "proverbe, povești"],
	["jurnal", "jurnal"],
	["studiu de folclor, descântece", "studiu de folclor, descântece"],
	["texte dialectale", "texte dialectale"],
	["nuvele, povestiri", "nuvele, povestiri"],
	["studiu lingvistic, texte dialectale", "studiu lingvistic, texte dialectale"],
	["medicină populară", "medicină populară"],
	["revistă literară", "revistă literară"],
	["balade", "balade"],
	["studiu paleografico-linguistic", "studiu paleografico-linguistic"],
	["studiu filologico-comparativ", "studiu filologico-comparativ"],
	["studiu de istoria limbii", "studiu de istoria limbii"],
	["schiță dramatică", "schiță dramatică"],
	["poem dramatic", "poem dramatic"],
	["studii, articole", "studii, articole"],
	["studii, articole, note", "studii, articole, note"],
	["istoria literaturii", "istoria literaturii"],
	["studiu de istorie literară", "studiu de istorie literară"],
	["cugetări", "cugetări"],
	["studiu etnolingvistic", "studiu etnolingvistic"],
	["studiu de toponimie", "studiu de toponimie"],
	["coprespondență", "coprespondență"],
	["poezii, pastorală, tragedie", "poezii, pastorală, tragedie"],
	["piese de teatru", "piese de teatru"],
	["poem istoric", "poem istoric"],
	["limbă literară", "limbă literară"],
	["basme, snoave", "basme, snoave"],
	["legende, basme", "legende, basme"],
	["legende, basme, ghicitori, proverbe", "legende, basme, ghicitori, proverbe"],
	["povestire istorică", "povestire istorică"],
	["pilde, ghicitori", "pilde, ghicitori"],
	["snoave", "snoave"],
	["zicători", "zicători"],
	["culegere de documente", "culegere de documente"],
	["istoria limbii", "istoria limbii"],
	["floclor", "floclor"],
	["critică literară, istorie literară", "critică literară, istorie literară"],
	["text juridic, studiu", "text juridic, studiu"],
	["text legislativ", "text legislativ"],
	["critică litarară", "critică litarară"],
	["studiu de lexic", "studiu de lexic"],
	["tratat de chimie", "tratat de chimie"],
	["epigrame", "epigrame"],
	["epopee", "epopee"],
	["recenzii, discursuri", "recenzii, discursuri"],
	["poezii, proză, teatru", "poezii, proză, teatru"],
	["anchete lingvistice", "anchete lingvistice"],
	["studiu etno-botanic, folclor", "studiu etno-botanic, folclor"],
	["studiu folcloric", "studiu folcloric"],
	["studiu istorico-etnografic comparativ.", "studiu istorico-etnografic comparativ."],
	["manual școlar", "manual școlar"],
	["eseu", "eseu"],
	["studii de economie politică", "studii de economie politică"],
	["divertisment comic", "divertisment comic"],
	["tragicomedie", "tragicomedie"],
	["falsă tragedie", "falsă tragedie"],
	["teză de licență", "teză de licență"],
	["text filosofic", "text filosofic"],
	["studiu de etimologie", "studiu de etimologie"],
	["studiu de terminologie", "studiu de terminologie"],
	["schițe, povestiri", "schițe, povestiri"],
	["studii, texte", "studii, texte"],
	["studiu lexico-semantic", "studiu lexico-semantic"],
	["studii de cultură și literatură", "studii de cultură și literatură"],
	["lexicologie, istoria lingvisticii", "lexicologie, istoria lingvisticii"],
	["scrieri în proză, versuri", "scrieri în proză, versuri"],
	["dramatizare", "dramatizare"],
	["revistă culturală și literară", "revistă culturală și literară"],
	["studiu de lexicografie", "studiu de lexicografie"],
	["aforisme, dicționar, schițe", "aforisme, dicționar, schițe"],
	["teatru scurt", "teatru scurt"],
	["revistă de muzică", "revistă de muzică"],
	["revistă de știință", "revistă de știință"],
	["istoria artei", "istoria artei"],
	["nuvele, romane", "nuvele, romane"],
	["poeme, nuvele", "poeme, nuvele"],
	["proză epistolară", "proză epistolară"],
	["proză, poezie", "proză, poezie"],
	["articole de limbă literară și lexic", "articole de limbă literară și lexic"],
	["articole, necrologuri", "articole, necrologuri"],
	["studiu de filosofie", "studiu de filosofie"],
	["studii de filosofie", "studii de filosofie"],
	["glosar dialectal", "glosar dialectal"],
	["pravilă", "pravilă"],
	["lingvistică romanică", "lingvistică romanică"],
	["istorie", "istorie"],
	["terminologie", "terminologie"],
	["articole, poezii, nuvele", "articole, poezii, nuvele"],
	["articole și studii", "articole și studii"],
	["corespondență, memorii", "corespondență, memorii"],
	["dare de seamă", "dare de seamă"],
	["studii, însemnări de călătorie, traduceri", "studii, însemnări de călătorie, traduceri"],
	["însemnări", "însemnări"],
	["studiu de arheologie", "studiu de arheologie"],
	["rapoarte, memorii", "rapoarte, memorii"],
	["studii de istorie a artei", "studii de istorie a artei"],
	["tratat de geometrie", "tratat de geometrie"],
	["studiu etnografic, folclor", "studiu etnografic, folclor"],
	["studiu etnografic, ghicitori", "studiu etnografic, ghicitori"],
	["studiu de istorie socială", "studiu de istorie socială"],
	["povești, anecdote", "povești, anecdote"],
	["fabule, povestiri", "fabule, povestiri"],
	["studiu lexical", "studiu lexical"],
	["poezii, balade", "poezii, balade"],
	["studii de medicină", "studii de medicină"],
	["studiu filologic și folkloric", "studiu filologic și folkloric"],
	["studii de etnologie", "studii de etnologie"],
	["algebră", "algebră"],
	["aritmetică", "aritmetică"],
	["trigonometrie", "trigonometrie"],
	["istoria religiei", "istoria religiei"],
	["studii de teologie", "studii de teologie"],
	["articole, proză literară, note de călătorie", "articole, proză literară, note de călătorie"],
	["poem epic", "poem epic"],
	["studii de istorie", "studii de istorie"],
	["proză lirică", "proză lirică"],
	["studii, articole, recenzii", "studii, articole, recenzii"],
	["studii istorico-filosofice", "studii istorico-filosofice"],
	["istorie universală", "istorie universală"],
	["geometrie", "geometrie"],
	["curs", "curs"],
	["anatomie", "anatomie"],
	["chimie", "chimie"],
	["fizică", "fizică"],
	["manual de medicină", "manual de medicină"],
	["poezii populare", "poezii populare"],
	["proză SF", "proză SF"],
	["tratat de drept", "tratat de drept"],
	["tratat de geografie", "tratat de geografie"],
	["floră", "floră"],
	["proverbe", "proverbe"],
	["indice de cuvinte", "indice de cuvinte"],
	["ornitologie", "ornitologie"],
	["studii de estetică și teoria literaturii", "studii de estetică și teoria literaturii"],
	["studiu de psihologie", "studiu de psihologie"],
	["studiu de filosofie a culturii", "studiu de filosofie a culturii"],
	["studii și articole de psihologie", "studii și articole de psihologie"],
	["studii de sociologie", "studii de sociologie"],
	["studii de artă și teorie literară", "studii de artă și teorie literară"],
	["studii de psihologie", "studii de psihologie"],
	["însemnări de călătorie, versuri, proză scurtă, teatru, articole", "însemnări de călătorie, versuri, proză scurtă, teatru, articole"],
	["povești, legende", "povești, legende"],
	["legende, folclor", "legende, folclor"],
	["cultivarea limbii", "cultivarea limbii"],
	["proverbe, ghicitori", "proverbe, ghicitori"],
	["studiu etnolingvistic; folclor", "studiu etnolingvistic; folclor"],
	["studii și articole de lingvistică", "studii și articole de lingvistică"],
	["istoria limbii, etimologie", "istoria limbii, etimologie"],
	["studiu de estetică", "studiu de estetică"],
	["proză autobiografică", "proză autobiografică"],
	["reportaj literar", "reportaj literar"],
	["nuvele, proză scurtă", "nuvele, proză scurtă"],
	["note de căltorie", "note de căltorie"],
	["impresii de călătorie", "impresii de călătorie"],
	["studiu biografic", "studiu biografic"],
	["articole, reportaje", "articole, reportaje"],
	["nuvele, shițe", "nuvele, shițe"],
	["note de călători, schițe", "note de călători, schițe"],
	["studiu lexicografic", "studiu lexicografic"],
	["odă", "odă"],
	["scrisori", "scrisori"],
	["eseu polemic", "eseu polemic"],
	["comedie dramatică", "comedie dramatică"],
	["articole, cronici, eseuri", "articole, cronici, eseuri"],
	["istoria lexicografiei", "istoria lexicografiei"],
	["stomatologie", "stomatologie"],
	["studiu istorico-etnografic comparativ", "studiu istorico-etnografic comparativ"],
	["astronomie", "astronomie"],
	["sfaturi practice, cugetări, snoave, anecdote, folclor", "sfaturi practice, cugetări, snoave, anecdote, folclor"],
	["narațiune istorică", "narațiune istorică"],
	["narațiune.", "narațiune."],
	["studii de pedagogie", "studii de pedagogie"],
	["articole, aforisme, note de călătorie", "articole, aforisme, note de călătorie"],
	["snoave, anecdote populare", "snoave, anecdote populare"],
	["dialoguri", "dialoguri"],
	["anecdote populare", "anecdote populare"],
	["studiu teologic și filosofic", "studiu teologic și filosofic"],
	["indice", "indice"],
	["studii și articole socila-politice", "studii și articole socila-politice"],
	["poveste populară", "poveste populară"],
	["studii de formarea cuvintelor", "studii de formarea cuvintelor"],
	["studii de gramatică", "studii de gramatică"],
	["studii de istorie a traducerii", "studii de istorie a traducerii"],
	["studiu de istoriografie", "studiu de istoriografie"],
	["studiu de istorie a armatei", "studiu de istorie a armatei"],
	["crirică literară, eseuri", "crirică literară, eseuri"],
	["studiu de versificație", "studiu de versificație"],
	["studiu genealogic și istoric", "studiu genealogic și istoric"],
	["istoria bisericii", "istoria bisericii"],
	["studiu de semantică", "studiu de semantică"],
	["antologie de texte", "antologie de texte"],
	["</title><idno type, old", "</title><idno type, old"],
	["studiu de etimologie și istoria cuvintelor", "studiu de etimologie și istoria cuvintelor"],
	["articole și studii social-politice", "articole și studii social-politice"],
	["antologie de texte, glosar", "antologie de texte, glosar"],
	["studiu de dialectologie", "studiu de dialectologie"],
	["studiu de istorie a bisericii", "studiu de istorie a bisericii"],
	["proză umoristică", "proză umoristică"],
	["studiu de istorie universală", "studiu de istorie universală"],
	["carte morală", "carte morală"],
	["studii de terminologie", "studii de terminologie"],
	["studii de terminologie, dicționar", "studii de terminologie, dicționar"],
	["acte și documente oficiale, articole, interviuri", "acte și documente oficiale, articole, interviuri"],
	["tratat de dialectologie", "tratat de dialectologie"],
	["lexicologie", "lexicologie"],
	["tratat de lingvistică", "tratat de lingvistică"],
	["studii de filologie", "studii de filologie"],
	["studiu de lingvistică", "studiu de lingvistică"],
	["repertoriu de cuvinte", "repertoriu de cuvinte"],
	["studii de critică literară", "studii de critică literară"],
	["studiu de istoria artei", "studiu de istoria artei"],
	["ceaslov", "ceaslov"],
	["studii de stilistică", "studii de stilistică"],
	["studii de artă și critică literară", "studii de artă și critică literară"],
	["articole și studii de filosofie", "articole și studii de filosofie"],
	["studii de filosofie a culturii", "studii de filosofie a culturii"],
	["studii de estetică", "studii de estetică"],
	["tratat de estetică", "tratat de estetică"],
	["versuri, aforisme, confesiuni", "versuri, aforisme, confesiuni"],
	["basm", "basm"],
	["publicistică și proză memorialistică", "publicistică și proză memorialistică"],
	["conferințe, articole", "conferințe, articole"],
	["nuvele, schițe, povestiri, proză memorialistică, cugetări", "nuvele, schițe, povestiri, proză memorialistică, cugetări"],
	["roman autobigrafic", "roman autobigrafic"],
	["eseuri, articole", "eseuri, articole"],
	["studii și articole de etimologie", "studii și articole de etimologie"],
	["studiu de mitologie", "studiu de mitologie"],
	["curs de medicină", "curs de medicină"],
	["studiu de argou", "studiu de argou"],
	["articole; proză memorialistică", "articole; proză memorialistică"],
	["proverbe, zicători, ghicitori", "proverbe, zicători, ghicitori"],
	["studii de critică și teorie literară", "studii de critică și teorie literară"],
	["studiu de sociologie politică", "studiu de sociologie politică"],
	["stihuri", "stihuri"],
	["poezie", "poezie"]
];

teian.dataInstances.siglumLabels = {
    "dlri-siglum": "Sigla DLRI",
    "dlri-siglum-firstname": "Sigla DLRI - prenume autor",
    "dlri-siglum-lastname": "Sigla DLRI - nume autor",
    "dlri-siglum-title": "Sigla DLRI - titlu lucrare",
    "dlri-siglum-volume": "Sigla DLRI - volum, tom, parte, fasciculă",
    "dlr-siglum": "Sigla DLR"
};

teian.dataInstances.collections = [
	["", "all"],
	["DLR2", "DLR2"],
	["CLRE", "CLRE"]
];

teian.dataInstances.languages = [
    ["ro", "română, alfabet latin"],
    ["fr", "franceză"],
    ["de", "germană"],
    ["grc-x-Byzantin", "greacă bizantină"],
    ["gre", "greacă medie"],
    ["la", "latină"],
    ["la-x-popular", "latina vulgară"],
    ["la-x-medieval", "latina medievală"],
    ["ru", "rusă"]
];

teian.dataInstances.sectionContainer = 
`
	.section-container {
	    border-radius: 6px;
	    background: #f0f7fb;
	    border: solid 1px #3498db;
	    line-height: 18px;
	    overflow: hidden;
	    padding: 5px;
	    margin-bottom: 20px;
	}     
`;

teian.dataInstances.awesomeButtonStyle = 
`
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    border: none;
    background-color: transparent;
    outline: none; 
`;

teian.actions.generateMarkup = function(strings, ...args) {
    const interleaved = args.reduce(
        (acc, arg, index) => {
            return [...acc, arg, strings[index + 1]];
        },
        [strings[0]]
    );
    
    return props => interleaved.map(part => (typeof part === "function" ? part(props) : part)).join("");
};

teian.dataInstances.hiBoldTemplate = teian.actions.generateMarkup`<hi xmlns="http://www.tei-c.org/ns/1.0" rend="bold\">${props => props.selection}</hi>`;

teian.dataInstances.hiItalicTemplate = teian.actions.generateMarkup`<hi xmlns="http://www.tei-c.org/ns/1.0" rend="italic\">${props => props.selection}</hi>`;

teian.dataInstances.hiUnderlineTemplate = teian.actions.generateMarkup`<hi xmlns="http://www.tei-c.org/ns/1.0" rend="underline\">${props => props.selection}</hi>`;
teian.dataInstances.hiSubscriptTemplate = teian.actions.generateMarkup`<hi xmlns="http://www.tei-c.org/ns/1.0" rend="subscript\">${props => props.selection}</hi>`;
teian.dataInstances.hiSuperscriptTemplate = teian.actions.generateMarkup`<hi xmlns="http://www.tei-c.org/ns/1.0" rend="superscript\">${props => props.selection}</hi>`;
teian.dataInstances.volumeProcessedTemplate =
	`
   		<t-relateditem xmlns="http://www.w3.org/1999/xhtml" data-name="relatedItem" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-relateditem" type="constituent">
			<t-titleinfo data-name="titleInfo" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-titleinfo" xml:lang="ro">
				<t-title data-name="title" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-title" />
				<t-subtitle data-name="subTitle" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-subtitle" />
		    </t-titleinfo>
		    <t-name data-name="name" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-name" type="personal">
			    	<t-namepart data-name="namePart" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-namepart"></t-namepart>
			    	<t-role data-name="role" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-role">
			    		<t-roleterm data-name="roleTerm" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-roleterm" type="text" authority="marcrelator"></t-roleterm>
			    	</t-role>
		    </t-name>
			<t-origininfo data-name="originInfo" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-origininfo">
				<t-place data-name="place" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-place" />
				<t-publisher data-name="publisher" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-publisher" />
		    </t-origininfo>			
			<t-language data-name="language" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-language">
				<t-scriptterm data-name="scriptTerm" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-scriptterm" type="code" authority="iso15924" />
		    </t-language>
			<t-physicaldescription data-name="physicalDescription" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-physicaldescription">
				<t-form data-name="form" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-form" authority="marcform" />
				<t-extent data-name="extent" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-extent" />
		    </t-physicaldescription>
			<t-imprint data-name="imprint" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-imprint">
				<t-date data-name="date" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-date" />
		    </t-imprint>
			<t-identifier data-name="identifier" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-identifier" type="dlri-siglum" />
			<t-identifier data-name="identifier" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-identifier" type="dlri-siglum-firstname" />
			<t-identifier data-name="identifier" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-identifier" type="dlri-siglum-lastname" />
			<t-identifier data-name="identifier" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-identifier" type="dlri-siglum-title" />
			<t-identifier data-name="identifier" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-identifier" type="dlri-siglum-volume" />
			<t-identifier data-name="identifier" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-identifier" type="dlr-siglum" />
		</t-relateditem>	
	`;
teian.dataInstances.otherVersionTemplate =
	`
		<relatedItem type="otherVersion">
		    <titleInfo xml:lang="ro">
		        <title/>
				<subTitle />
		    </titleInfo>                        
		    <originInfo>
		        <dateIssued/>
		    </originInfo>
		</relatedItem>	
	`;
teian.dataInstances.titleInfoProcessedTemplate =
	`
		<t-titleinfo xmlns="http://www.w3.org/1999/xhtml" data-name="titleInfo" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-titleinfo" xml:lang="ro">
			<t-title data-name="title" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-title" />
			<t-subtitle data-name="subTitle" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-subtitle" />
	    </t-titleinfo>

	`;	
teian.dataInstances.roleTermProcessedTemplate = teian.actions.generateMarkup`
	<t-roleterm data-name="roleTerm" data-ns="http://www.loc.gov/mods/v3" data-value="${props => props.roleTerm}" slot="t-roleterm" type="text" authority="marcrelator"></t-roleterm>
`;

teian.dataInstances.nameProcessedTemplate = teian.actions.generateMarkup`
    <t-name xmlns="http://www.w3.org/1999/xhtml" data-name="name" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-name" type="personal">
	    	<t-namepart data-name="namePart" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-namepart"></t-namepart>
	    	<t-role data-name="role" data-ns="http://www.loc.gov/mods/v3" data-value="" slot="t-role">
			${teian.dataInstances.roleTermProcessedTemplate({"roleTerm": ""})}
	    	</t-role>
    </t-name>
`;

teian.frameworkDefinition = {
    "new-file-template": 
    teian.actions.generateMarkup`
        <mods xmlns="http://www.loc.gov/mods/v3" ID="${props => props.uuid}">
            <titleInfo xml:lang="ro">
                <title />
                <subTitle />
            </titleInfo>
            <name type="personal">
                <namePart/>  
                <role />              
            </name> 
            <genre/>
            <originInfo>
                <place/>
                <publisher/>
            </originInfo>  
		    <language>
		        <scriptTerm type="code" authority="iso15924"/>
		    </language>                              
            <physicalDescription>
                <form authority="marcform">print</form>
                <extent/>
            </physicalDescription>
            <identifier type="collection">all</identifier>
            <identifier type="dlri-siglum" />
            <identifier type="dlri-siglum-firstname"/>
            <identifier type="dlri-siglum-lastname"/>
            <identifier type="dlri-siglum-title"/>
            <identifier type="dlri-siglum-volume"/>
            <identifier type="dlr-siglum"/>
            <imprint>
                <date/>
            </imprint>
			<location>
			  <url/>
			</location>
			<accessCondition type="use and reproduction">
				Use of this resource is governed by the terms and conditions of the Creative Commons
				 "Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)" License
				(https://creativecommons.org/licenses/by-nc-sa/4.0/).
			</accessCondition>
        </mods>    
    `
    ,
    "t-mods-template":
        `
            <style>
                ${teian.dataInstances.sectionContainer}
                :host(*) {
                		counter-reset: volume;
				}
            </style>
            <div class="section-container">
                <slot name="t-identifier"></slot>
            </div>  
            <slot name="t-titleinfo"></slot>
            <slot name="t-name"></slot>
            <div class="section-container">
                <slot name="t-genre"></slot>
            </div>  
            <div class="section-container">
            		<slot name="t-origininfo"></slot>
				<slot name="t-language"></slot>
            		<slot name="t-physicaldescription"></slot>
				<slot name="t-imprint"></slot>
				<slot name="t-location"></slot>
            </div>
            <slot name="t-relateditem"></slot>            
        `
    ,
    "t-titleinfo-template":
        `
            <style>
                :host(*)::before {
					content: "Titlu și subtitlu"; 
					font-weight: bold;               	
                }
                fieldset {
                    border-radius: 6px;
                    background-color: #f0f7fb;
                    border: 1px solid #3498db;
                    line-height: 18px;
                    overflow: hidden;
                    margin-bottom: 20px;
                }
                legend {
                		width: 100%;
                } 
		        legend > div { 
					display: grid;
             	    grid-template-columns: repeat(2, 1fr);
		        } 
                legend button {
                    ${teian.dataInstances.awesomeButtonStyle} 
                }
                #legend-left {
                		text-align: right;
                } 
            </style>
            <fieldset>
            		<legend>
					<div>
						<div>
							<label for="language">limbă</label>
							<select id="language" data-ref="@xml:lang">
								${teian.dataInstances.languages.map(language => `<option value="${language[0]}">${language[1]}</option>`).join('')}
	                    		</select>							
						</div>
						<div id="legend-left">
							<button onclick="teian.update.insertAfter((new DOMParser()).parseFromString(teian.dataInstances.titleInfoProcessedTemplate, 'application/xml').documentElement.cloneNode(true), this.hostElement);">&#xf067;</button>
							<button id="delete-button" onclick="teian.update.delete(this.hostElement);" disabled="true">&#xf2ed;</button>										
						</div>
					</div>					
				</legend>
	            <slot name="t-title"></slot>
	            <slot name="t-subtitle"></slot>
            </fieldset>          
        `
    ,
    "t-title-template":
        `
            <style>
                div.container {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
                #mini-editor {
                    border-radius: 6px;
                    min-width: 500px;
                    max-width: 550px;
                    min-height: 40px;
                    border: 1px solid #ccc;
                    background-color: white;
                    font-size: 14px;
                }
                #toolbar button {
                    ${teian.dataInstances.awesomeButtonStyle}
                }
                hi[rend = 'bold'] {
                    font-weight: bold;
                }
                hi[rend = 'italic'] {
                    font-style: italic;
                }
                hi[rend = 'underline'] {
                    text-decoration: underline;
                } 
                hi[rend = 'subscript'] {
                    vertical-align: sub;
                    font-size: smaller;
                } 
                hi[rend = 'superscript'] {
                    vertical-align: super;
                    font-size: smaller;
                }                
            </style>
            <div class="container">
                <label>Titlu</label>
                <div>
                    <div id="toolbar">
                        <button onclick="teian.actions.clearTextFormatting(this.parentNode.parentNode.children[1]);">&#xf87d;</button>                    
                        <button onclick="teian.actions.execCommand(teian.dataInstances.hiBoldTemplate);">&#xf032;</button>
                        <button onclick="teian.actions.execCommand(teian.dataInstances.hiItalicTemplate);">&#xf033;</button>
                        <button onclick="teian.actions.execCommand(teian.dataInstances.hiUnderlineTemplate);">&#xf0cd;</button>
                        <button onclick="teian.actions.execCommand(teian.dataInstances.hiSubscriptTemplate);">&#xf12c;</button>
                        <button onclick="teian.actions.execCommand(teian.dataInstances.hiSuperscriptTemplate);">&#xf033;</button>
                    </div>
                    <div id="mini-editor" contenteditable="true" data-ref="#text"></div>
                </div>
            </div>
        `
    ,
    "t-subtitle-template":
        `
            <style>
                div.container {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
                #mini-editor {
                    border-radius: 6px;
                    min-width: 500px;
                    max-width: 550px;
                    min-height: 40px;
                    border: 1px solid #ccc;
                    background-color: white;
                    font-size: 14px;
                }
                #toolbar button {
                    ${teian.dataInstances.awesomeButtonStyle}
                }
                hi[rend = 'bold'] {
                    font-weight: bold;
                }
                hi[rend = 'italic'] {
                    font-style: italic;
                }
                hi[rend = 'underline'] {
                    text-decoration: underline;
                } 
                hi[rend = 'subscript'] {
                    vertical-align: sub;
                    font-size: smaller;
                } 
                hi[rend = 'superscript'] {
                    vertical-align: super;
                    font-size: smaller;
                }                
            </style>
            <div class="container">
                <label>Subtitlu</label>
                <div>
                    <div id="toolbar">
                        <button onclick="teian.actions.clearTextFormatting(this.parentNode.parentNode.children[1]);">&#xf87d;</button>                    
                        <button onclick="teian.actions.execCommand(teian.dataInstances.hiBoldTemplate);">&#xf032;</button>
                        <button onclick="teian.actions.execCommand(teian.dataInstances.hiItalicTemplate);">&#xf033;</button>
                        <button onclick="teian.actions.execCommand(teian.dataInstances.hiUnderlineTemplate);">&#xf0cd;</button>
                        <button onclick="teian.actions.execCommand(teian.dataInstances.hiSubscriptTemplate);">&#xf12c;</button>
                        <button onclick="teian.actions.execCommand(teian.dataInstances.hiSuperscriptTemplate);">&#xf033;</button>
                    </div>
                    <div id="mini-editor" contenteditable="true" data-ref="#text"></div>
                </div>
            </div>
        `
    ,
    "t-physicaldescription-template":
        `
            <slot name="t-extent"></slot>
        `
    ,
    "t-extent-template":
        `
            <style>
                div {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
            </style>
            <div>
                <label for="extent">Nr. de pagini</label>
                <input id="extent" data-ref="#text"/>
            </div>
        `,
    "t-imprint-template":
        `
            <slot name="t-date"></slot>
        `
    ,   
    "t-date-template":
        `
            <style>
                div {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
                div input {
                		width: 561px;
                }
            </style>
            <div>
                <label for="date">Data publicării</label>
                <input id="date" data-ref="#text"/>
            </div>
        `,
    "t-origininfo-template":
        `
            <slot name="t-publisher"></slot>
            <slot name="t-place"></slot>
        `
    ,      
    "t-publisher-template":
        `
            <style>
                div {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
                div input {
                		width: 561px;
                }                
            </style>
            <div>
                <label for="publisher">Editura</label>
                <input id="publisher" data-ref="#text"/>
            </div>
        `,
    "t-place-template":
        `
            <style>
                div {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
                div input {
                		width: 561px;
                }
            </style>
            <div>
                <label for="place">Locul publicării</label>
                <input id="place" data-ref="#text"/>
            </div>
        `, 
    "t-language-template":
        `
            <slot name="t-scriptterm"></slot>
        `
    ,   
    "t-scriptterm-template":
        `
            <style>
                div {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
                div input {
                		width: 561px;
                }
            </style>
            <div>
                <label for="scriptterm">Alfabet</label>
                <input id="scriptterm" data-ref="#text"/>
            </div>
        `,          
    "t-location-template":
        `
            <slot name="t-url"></slot>
        `
    ,   
    "t-url-template":
        `
            <style>
                div {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
                div input {
                		width: 561px;
                }
            </style>
            <div>
                <label for="url">Adresă web</label>
                <input id="url" data-ref="#text"/>
            </div>
        `,                      
    "t-name-template":
        `
            <style>
				:host(*)::before {
					content: "Nume și prenume, roluri";
					font-weight: bold;
				}            
                fieldset {
                    border-radius: 6px;
                    background-color: #f0f7fb;
                    border: 1px solid #3498db;
                    line-height: 18px;
                    overflow: hidden;
                    margin-bottom: 20px;
                }
                legend {
                		width: 100%;
                } 
		        legend > div { 
					display: grid;
             	    grid-template-columns: repeat(2, 1fr);
		        } 
                legend button {
                    ${teian.dataInstances.awesomeButtonStyle} 
                }
                #legend-left {
                		text-align: right;
                }  
            </style>
            <fieldset>
            		<legend>
					<div>
						<div></div>
						<div id="legend-left">
							<button onclick="teian.update.insertAfter((new DOMParser()).parseFromString(teian.dataInstances.nameProcessedTemplate(), 'application/xml').documentElement.cloneNode(true), this.hostElement);">&#xf067;</button>
							<button id="delete-button" onclick="teian.update.delete(this.hostElement);" disabled="true">&#xf2ed;</button>						
						</div>
					</div>
				</legend>
                <slot name="t-namepart"></slot>                
                <kuberam-multiselect placeholder="Roluri" data-ref="t-role > t-roleterm" data-itemset="teian.dataInstances.roles" onSelect="" onDeselect="teian.update.delete(this.hostElement)" width="620px"></kuberam-multiselect>
            </fieldset>             
        `,
    "t-namepart-template":
        `
            <style>
                input {
                    margin-top: 6px;
                    width: 620px;
                }
            </style>        
            <input data-ref="#text" slot="t-namepart" />
        `,
    "t-identifier-template":
        `
            <style>
                div {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
                :host([type = 'collection']) label::before {
                  content: "Colecție";
                } 
                :host([type = 'collection']) input {
                  display: none;
                }
                :host([type = 'collection']) select {
                  width: 243px;
                }                
                :host([type ^= 'dlr']) select {
                  display: none;
                }                                                  
                :host([type = 'dlri-siglum']) label::before {
                  content: "${teian.dataInstances.siglumLabels['dlri-siglum']}";
                }                
                :host([type = 'dlri-siglum-firstname']) label::before {
                  content: "${teian.dataInstances.siglumLabels['dlri-siglum-firstname']}";
                }                
                :host([type = 'dlri-siglum-lastname']) label::before {
                  content: "${teian.dataInstances.siglumLabels['dlri-siglum-lastname']}";
                }                
                :host([type = 'dlri-siglum-title']) label::before {
                  content: "${teian.dataInstances.siglumLabels['dlri-siglum-title']}";
                }                
                :host([type = 'dlri-siglum-volume']) label::before {
                  content: "${teian.dataInstances.siglumLabels['dlri-siglum-volume']}";
                }                
                :host([type = 'dlr-siglum']) label::before {
                  content: "${teian.dataInstances.siglumLabels['dlr-siglum']}";
                } 
            </style>   
            <div>
                <label for="identifier"></label>
                <input id="identifier" data-ref="#text"/>
                <select id="collection" data-ref="#text">
                    ${teian.dataInstances.collections.map(collection => `<option value="${collection[1]}">${collection[0]}</option>`)}
                </select>                
            </div>
        `,
    "t-genre-template":
        `
            <style>
                div {
                    display: grid;
                    grid-template-columns: 200px max-content;
                    grid-gap: 5px;
                }
            </style>
            <div>
                <label for="genre">Genul lucrării</label>
                <select id="genre" data-ref="#text">
                    ${genres.map(genre => `<option value="${genre[1]}">${genre[0]}</option>`)}
                </select>                 
            </div>
        `,
    "t-relateditem-template":
        `
            <style>
                :host([type = 'constituent'])::before {
                	  counter-increment: volume;
                  content: 'Volum 'counter(volume); 
                  font-weight: bold;               
                }            
                :host([type = 'otherVersion'])::before {
                  content: "Ediție de lucru";
                  font-weight: bold;
                }  
                #expanded-content {
                		display: none;
                }
                fieldset {
                    border-radius: 6px;
                    background-color: #f0f7fb;
                    border: 1px solid #3498db;
                    line-height: 18px;
                    overflow: hidden;
                    margin-bottom: 20px;
                }
                legend {
                		width: 100%;
                } 
		        legend > div { 
					display: grid;
             	    grid-template-columns: repeat(2, 1fr);
		        } 
                legend button {
                    ${teian.dataInstances.awesomeButtonStyle} 
                }
                #legend-left {
                		text-align: right;
                }
            </style>
            <div id="constituent-content">
	            <fieldset>
	            		<legend>
						<div>
							<div></div>
							<div id="legend-left">
								<button id="expand-collapse-button" onclick="teian.actions.expandCollapseVolumeContent(this);" title="Expansionare" data-action="collapse">&#xf065;</button>								
								<button onclick="teian.update.insertAfter((new DOMParser()).parseFromString(teian.dataInstances.volumeProcessedTemplate, 'application/xml').documentElement.cloneNode(true), this.hostElement);" title="Adăugare volum">&#xf067;</button>
								<button onclick="teian.update.delete(this.hostElement);" title="Ștergere volum">&#xf2ed;</button>
							</div>
						</div>
					</legend>				
	            		<div id="collapsed-content">
						<label id="collapsed-titleInfo"></label>
					</div>
	            		<div id="expanded-content">						
		                <slot name="t-identifier"></slot>
		                <slot name="t-titleinfo"></slot>
		                <slot name="t-name"></slot>
		            		<slot name="t-origininfo"></slot>
						<slot name="t-language"></slot>
		            		<slot name="t-physicaldescription"></slot>                
						<slot name="t-imprint"></slot>
					</div>						
	            </fieldset>
			</div>
        `
};

customElements.define("t-mods", class extends teian.divClass {
    constructor() {
        super();
    }
});            
customElements.define("t-title", class extends teian.formControlClass {
    constructor() {
        super();
    }
}); 
customElements.define("t-subtitle", class extends teian.formControlClass {
    constructor() {
        super();
    }
});  
customElements.define("t-titleinfo", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-physicaldescription", class extends teian.divClass {
    constructor() {
        super();
    }
});
customElements.define("t-extent", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-imprint", class extends teian.divClass {
    constructor() {
        super();
    }
});
customElements.define("t-date", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-origininfo", class extends teian.divClass {
    constructor() {
        super();
    }
});
customElements.define("t-publisher", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-place", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-language", class extends teian.divClass {
    constructor() {
        super();
    }
});
customElements.define("t-scriptterm", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-location", class extends teian.divClass {
    constructor() {
        super();
    }
});
customElements.define("t-url", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-name", class extends teian.formControlClass {
    constructor() {
        super();
    }
});            
customElements.define("t-namepart", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-identifier", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-genre", class extends teian.formControlClass {
    constructor() {
        super();
    }
});
customElements.define("t-relateditem", class extends teian.formControlClass {
    constructor() {
        super();
    }
});   

teian.actions.execCommand = function(template) {
    document.execCommand('insertHTML', false, template({"selection": window.getSelection()}));
};

teian.actions.expandCollapseVolumeContent = button => {
	const constituentContentElement = button.closest("#constituent-content");
	
	console.log(button.dataset.action);
	if (button.dataset.action == "collapse") {
		constituentContentElement.querySelector("#expand-collapse-button").innerHTML = "&#xf066;";
		constituentContentElement.querySelector("#expand-collapse-button").title = "Restrângere";		
				
		constituentContentElement.querySelector("#collapsed-content").style.display = "none";
		constituentContentElement.querySelector("#expanded-content").style.display = "inline";	
		
		button.dataset.action = "expand";		
	} else {
		constituentContentElement.querySelector("#expand-collapse-button").innerHTML = "&#xf065;";
		constituentContentElement.querySelector("#expand-collapse-button").title = "Expansionare";		
		
		constituentContentElement.querySelector("#expanded-content").style.display = "none";	
		constituentContentElement.querySelector("#collapsed-content").style.display = "inline";
			
		teian.actions.initializeCollapsedTitleInfo(constituentContentElement.hostElement);
		
		button.dataset.action = "collapse";
	}
};

teian.actions.initializeAllCollapsedTitleInfo = () => {
	var content = document.querySelector("teian-editor").shadowRoot.querySelector("#content");
	content.querySelectorAll(":scope > * > *[data-name = 'relatedItem'][type = 'constituent']").forEach((volumeElement) => teian.actions.initializeCollapsedTitleInfo(volumeElement));	
};

teian.actions.initializeCollapsedTitleInfo = (volumeElement) => {
	const titleInfo = Array.from(volumeElement.querySelectorAll("*[data-name = 'titleInfo'] > *[data-name = 'title'], *[data-name = 'titleInfo'] > *[data-name = 'subTitle']")).map(element => element.dataset.value).filter(value => value).join(". ");
	volumeElement.shadowRoot.querySelector("#collapsed-titleInfo").textContent = titleInfo;
};

teian.actions.initializeSortableVolumes = () => {
	var content = document.querySelector("teian-editor").shadowRoot.querySelector("#content");
	var root = content.querySelector("*[data-name = 'mods']");
	root.setAttribute("class", "list-group");
	content.querySelectorAll(":scope > * > *[data-name = 'relatedItem'][type = 'constituent']").forEach((volumeElement) => volumeElement.setAttribute("class", "list-group-item"));
	
	new Sortable(root, {
	    animation: 150,
	    fallbackOnBody: true,
	    swapThreshold: 0.65,
		ghostClass: "blue-background-class"
	});
};
