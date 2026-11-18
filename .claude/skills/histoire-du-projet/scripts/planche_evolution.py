#!/usr/bin/env python3
"""Fait une image « avant / après » : les versions successives d'un écran, côte à côte, avec leur titre.

Usage :
    python3 planche_evolution.py --titre "Debout — l'évolution du design" \\
        --sous-titre "De l'idée à l'envoi chez Apple en 27 jours" \\
        --sortie design/evolution-design.png \\
        "1 · Premier jet|22 oct.|design/v1/accueil.png" \\
        "2 · DA néon|22 oct. · rejetée|design/v2/accueil.png" \\
        "3 · Version finale|18 nov.|design/app-store/accueil.png"

Chaque version s'écrit "titre|sous-titre|image", avec en option "|x,y,largeur,hauteur" pour ne garder qu'une partie de
l'image (utile quand l'image contient plusieurs écrans). La dernière version est mise en valeur. Il faut Pillow
(pip install pillow).
"""

import argparse
import glob

from PIL import Image, ImageDraw, ImageFont, ImageOps

FOND = (10, 11, 26)
TEXTE = (246, 240, 230)
GRIS = (170, 165, 195)
ACCENT = (255, 190, 110)


def police(gras: bool, serif: bool, taille: int):
    noms = ["DejaVuSerif-Bold.ttf"] if serif else (["DejaVuSans-Bold.ttf", "Arial Bold.ttf"] if gras else ["DejaVuSans.ttf", "Arial.ttf"])
    dossiers = ["/usr/share/fonts/truetype/dejavu/", "/Library/Fonts/", "/System/Library/Fonts/Supplemental/", ""]
    for nom in noms:
        for dossier in dossiers:
            for chemin in glob.glob(dossier + nom) or [dossier + nom]:
                try:
                    return ImageFont.truetype(chemin, taille)
                except OSError:
                    continue
    return ImageFont.load_default()


def charger(spec: str):
    morceaux = spec.split("|")
    if len(morceaux) < 3:
        raise SystemExit(f"Version mal écrite : {spec!r} (il faut \"titre|sous-titre|image\")")
    titre, sous_titre, chemin = morceaux[:3]
    image = Image.open(chemin).convert("RGB")
    if len(morceaux) > 3 and morceaux[3]:
        x, y, w, h = (int(v) for v in morceaux[3].split(","))
        image = image.crop((x, y, x + w, y + h))
    return titre, sous_titre, image


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("versions", nargs="+", help='"titre|sous-titre|image[|x,y,largeur,hauteur]"')
    parser.add_argument("--titre", default="L'évolution du design")
    parser.add_argument("--sous-titre", default="")
    parser.add_argument("--sortie", default="evolution-design.png")
    args = parser.parse_args()

    versions = [charger(v) for v in args.versions]
    largeur, hauteur, marge, espace, haut = 520, 1130, 48, 40, 230
    n = len(versions)
    planche = Image.new("RGB", (marge * 2 + largeur * n + espace * (n - 1), haut + hauteur + 110), FOND)
    dessin = ImageDraw.Draw(planche)
    dessin.text((marge, 50), args.titre, font=police(True, True, 64), fill=TEXTE)
    if args.sous_titre:
        dessin.text((marge, 135), args.sous_titre, font=police(False, False, 30), fill=GRIS)

    for i, (titre, sous_titre, image) in enumerate(versions):
        x = marge + i * (largeur + espace)
        image = ImageOps.fit(image, (largeur, hauteur), Image.LANCZOS, centering=(0.5, 0.0))
        masque = Image.new("L", (largeur, hauteur), 0)
        ImageDraw.Draw(masque).rounded_rectangle((0, 0, largeur - 1, hauteur - 1), radius=36, fill=255)
        planche.paste(image, (x, haut), masque)
        dessin.rounded_rectangle((x, haut, x + largeur - 1, haut + hauteur - 1), radius=36, outline=(60, 58, 90), width=2)
        derniere = i == n - 1
        dessin.text((x, haut + hauteur + 22), titre, font=police(True, False, 34), fill=ACCENT if derniere else TEXTE)
        dessin.text((x, haut + hauteur + 66), sous_titre, font=police(False, False, 25), fill=GRIS)

    planche.save(args.sortie, optimize=True)
    print(f"Planche enregistrée : {args.sortie} ({planche.width} × {planche.height})")


if __name__ == "__main__":
    main()
