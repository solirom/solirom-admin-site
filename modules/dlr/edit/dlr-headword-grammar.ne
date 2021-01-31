headword -> headwordLetters space gramGrp {% data => data.join("") %}
gramGrp -> (adj | adv | art | conj | interj | num | prep | pron | s | sPr | subst | verb | loc) {% id => "<gramGrp xmlns=\"http://www.tei-c.org/ns/1.0\">" + id + "</gramGrp>" %}

adj -> "adj." {% id => '<pos value="' + id + '" />' %}
	| adj space adjType {% data => data.join("") %}
	| adj space adjType space adjNumber {% data => data.join("") %}
adjType -> ("dem." | "interog.-rel." | "nehot." | "pos.") {% id => '<subc value="' + id + '" />' %}
adjNumber -> "invar." {% id => '<number value="' + id + '" />' %}

adv -> "adv." {% id => '<pos value="' + id + '" />' %}
	| adv space advType {% data => data.join("") %}
advType -> "interog." {% id => '<subc value="' + id + '" />' %}

art -> "art." {% id => '<pos value="' + id + '" />' %}
	| art space artType {% data => data.join("") %}
artType -> ("adj." | "hot." | "nehot." | "pos.") {% id => '<subc value="' + id + '" />' %}

conj -> "conj." {% id => '<pos value="' + id + '" />' %}

interj -> "interj." {% id => '<pos value="' + id + '" />' %}

num -> "num." {% id => '<pos value="' + id + '" />' %}
	| num space numType {% data => data.join("") %}
numType -> ("adv." | "card." | "col." | "multipl." | "nehot." | "ord.") {% id => '<subc value="' + id + '" />' %}

prep -> "prep." {% id => '<pos value="' + id + '" />' %}

pron -> "pron." {% id => '<pos value="' + id + '" />' %}
	| pron space pronType {% data => data.join("") %}
	| pron space pronType space gender1 {% data => data.join("") %}
	| pron space pronType space gender1 space pronPerson {% data => data.join("") %}
	| pron space pronType space gender1 space pronPerson space number1 {% data => data.join("") %}
	| pron space pronType space gender1 space pronPerson space number1 space pronPosition {% data => data.join("") %}
	| pron space pronType space gender1 space pronPerson space number1 space pronPosition space articulation {% data => data.join("") %}
pronType -> ("dem." | "interog.-rel."  | "întăr." | "neg." | "nehot." | "pers." | "pos." | "refl." | "de politeţe") {% id => '<subc value="' + id + '" />' %}
pronPerson -> ("la pers. 1" | "la pers. 2" | "la pers. 3") {% id => '<per value="' + id + '" />' %}
pronPosition -> ("antepus" | "postpus") {% id => '<subc value="' + id + '" />' %} 
            
s -> "s." {% id => '<pos value="' + id + '" />' %}
	| s comma gender2 {% data => data.join("") %}
	| s comma gender2 comma number2 {% data => data.join("") %}
	| s comma gender2 comma number2 comma sCase {% data => data.join("") %}
	| s comma gender2 comma number2 comma sCase comma articulation {% data => data.join("") %}
sCase -> ("dat."| "gen.-dat." | "gen.-dat. și" | "gen.-dat. sg." | "gen.-dat. sg. și" | "gen.-dat. pl." | "gen.-dat. pl. și" | "voc.") {% id => '<case value="' + id + '" />' %}

sPr -> "s. pr." {% id => '<pos value="' + id + '" />' %}
	| sPr space articulation {% data => data.join("") %}
	
subst -> "subst."  {% id => '<pos value="' + id + '" />' %}
	| subst space number1 {% data => data.join("") %}	

verb -> "vb."  {% id => '<pos value="' + id + '" />' %}
	| verb space verbConjugation {% data => data.join("") %}
verbConjugation -> ("I" | "II" | "III" | "IV") {% id => '<iType value="' + id + '" />' %}

loc -> "loc."  {% id => '<pos value="' + id + '" />' %}
	| loc space locType {% data => data.join("") %}
locType -> ("adj." | "adv." | "prep." | "conj." | "vb."	) {% id => '<subc value="' + id + '" />' %}

headwordLetters -> [A-ZÁÉÍÓÚẮẤŞŢĂÂÎȘȚ]:+ digits {% data => '<form xmlns=\"http://www.tei-c.org/ns/1.0\" type="lemma"><orth n="' + data[1] + '">' + data[0].join("") + '</orth></form>' %}
gender1 -> ("f." | "m." | "m. și f.") {% id => '<gen value="' + id + '" />' %}
gender2 -> ("f." | "m." | "m. și f." | "n.") {% id => '<gen value="' + id + '" />' %}
number1 -> ("sg." | "pl.") {% id => '<number value="' + id + '" />' %}
number2 -> ("sg." | "pl." | "invar.") {% id => '<number value="' + id + '" />' %}
articulation -> "art." {% id => '<subc value="' + id + '" />' %}
digits -> [0-9]:?
comma -> "," space {% data => data.join("") %}
space -> " "

