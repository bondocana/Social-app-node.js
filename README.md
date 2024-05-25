Aplicatia este realizata cu Node.js si Express si este o platforma de socializare care permite utilizatorilor sa se inregistreze, sa se autentifice si sa interactioneze cu continutul generat de ei insisi si de prietenii lor. Utilizatorii pot crea postari noi, comenta pe postarile existente si pot da like sau dislike atat postarilor, cat si comentariilor. Timeline-ul fiecarui utilizator afiseaza postarile proprii si ale prietenilor, oferind o experienta sociala dinamica si personalizata.

Register:
- un utilizator nou accesează aplicatia si completeaza un formular de inregistrare
- informatiile furnizate de utilizator (cum ar fi numele, adresa de email si parola) sunt trimise catre server
- ie server, informatiile sunt validate pentru a se asigura ca sunt in formatul corect si ca adresa de email nu este deja folosita
- daca toate informatiile sunt valide, contul este creat in baza de date, iar utilizatorul primeste un raspuns ca inregistrarea a fost finalizata cu succes

Log in:
- dupa ce s-a inregistrat, utilizatorul poate sa se autentifice cu adresa de email si parola
- aceste informatii sunt trimise catre server pentru autentificare
- serverul verifica daca exista un cont cu adresa de email si parola furnizate
- daca informatiile sunt corecte, serverul genereaza un token de autentificare si il stocheaza intr-un cookie pentru a-l folosi in cererile ulterioare catre server

Vizualizare postari:
- dupa autentificare, utilizatorul acceseaza pagina de timeline
- serverul extrage postarile din baza de date, inclusiv postarile utilizatorului si ale prietenilor sai
- postarile sunt returnate catre client si afisate pe pagina de timeline

Adaugare postare:
- utilizatorul completeaza un formular pentru a adauga o postare noua
- clientul trimite detaliile postarii catre server
- serverul valideaza si stocheaza postarea in baza de date, asociind-o cu contul utilizatorului

Adaugare comentariu:
- utilizatorul vizualizeaza o postare si decide sa adauge un comentariu
- serverul valideaza si stocheaza comentariul in baza de date, asociindu-l cu postarea respectiva

Like postare sau comentariu:
- utilizatorul apasa pe butonul de like sau dislike de langa o postare sau un comentariu
- clientul trimite cererea catre server, impreuna cu ID-ul user-ului si al comentariului
- serverul actualizeaza array-ul de like-uri pentru postare sau comentariu in baza de date
