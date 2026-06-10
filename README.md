# Das Lost Update Problem

Dieses Projekt enthält ein einfaches SPA-Frontend, das in Angular implementiert ist.

Wie die meisten Business-Anwendungen hat auch diese Anwendung ein Backend, das Daten in einer Datenbank speichert. Das Frontend kommuniziert über eine `REST-API` mit dem Backend.

Dein PO hat gefordert, dass alle vom Benutzer eingegebenen Daten sofort gespeichert werden.
Es stellt sich heraus, dass deine Entwicklerkollegen das Wort „sofort“ etwas zu wörtlich genommen haben.

## Der Fehlerbericht

Benutzer beginnen sich zu beschweren, als sie bemerken, dass ihre sorgfältig gesetzten Checkboxen nicht gespeichert werden – oder eher, dass nur _einige_ von ihnen gespeichert werden, was sie völlig verwirrt.

„Es muss ein Problem im Design geben“, murmelt dein Lead Developer.

## Das Backend

Das Backend ist eine einfache `REST-API`, die Daten in einer Datenbank speichert.

Du kannst die API-Spezifikation in [service.yaml](service.yaml) einsehen.

_Bitte ändere die `REST-API` oder den Backend-Code nicht, um dieses Problem zu lösen._

Natürlich würden wir in der Realität das API-Design möglicherweise überarbeiten, um es robuster zu machen, aber für diese Übung gehen wir davon aus, dass die API festgelegt ist.

## Aufgabe

- Lass uns zunächst die Architektur, die `REST-API` und mögliche Probleme besprechen, wobei das Hauptproblem darin besteht, dass der Zustand nicht robust gespeichert wird.
- Führe die [e2e-tests](e2e-tests) aus und sieh dir an, welche fehlschlagen. Vielleicht geben bereits einige der Tests einen Hinweis.
- Anschließend besprechen wir potenzielle Lösungen.
- Schließlich implementieren wir eine Lösung.

## Los geht's

**Node.js Version:** Dieses Projekt verwendet Angular 20 und benötigt eine aktuelle Node LTS Version (20 oder 22).

### Node.js Version überprüfen und installieren

```sh
# Aktuelle Version prüfen
node --version

# Mit nvm die richtige Version installieren (empfohlen):
nvm install 20  # oder 22
nvm use 20      # oder 22
```

### Dependencies installieren

Ein einziger Befehl installiert alle Dependencies für Frontend, Backend und E2E-Tests:

```sh
npm ci
```

### Starte das Backend

```sh
npm run start-backend
```

### Starte das Frontend

```sh
npm run start-frontend
```

### Starte die End-to-End-Tests

```sh
npm run run-e2e-tests
```

## Dinge die uns wichtig sind

- Analytischer Ansatz
- Kernprobleme identifizieren und lösen
- Ende-zu-Ende-Verständnis
- Minimale Komplexität
- Keine unnötigen Bibliotheken oder Frameworks hinzufügen
