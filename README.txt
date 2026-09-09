Vorschule-Entdecker V2 – Monster-Truck-Bilder

monster-trucks.json ist JSON Lines: exakt ein Truck pro Zeile.
Neue Felder: image, imagePage, fandomUrl.

Bilder einlesen:
1. pip install -r requirements.txt
2. python update_monster_truck_images.py
3. monster-trucks.json anschließend auf GitHub hochladen.

Der Updater fragt die jeweilige Hot-Wheels-Fandom-Jahresseite über deren MediaWiki-API ab,
sucht primär anhand der Toy-Nummer und übernimmt ein Bild aus derselben Tabellenzeile.
Die App nutzt image sowohl bei der Belohnung als auch im Sammelalbum.
