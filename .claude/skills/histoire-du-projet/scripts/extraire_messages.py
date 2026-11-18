#!/usr/bin/env python3
"""Sort les messages de l'utilisateur d'un projet Claude Code, avec leur date, pour écrire l'histoire du projet.

Usage :
    python3 extraire_messages.py                 # projet du dossier courant
    python3 extraire_messages.py /chemin/projet  # un autre projet
    python3 extraire_messages.py --dossier ~/.claude/projects/-home-moi-mon-projet

Lit les conversations enregistrées dans ~/.claude/projects/<chemin du projet>/*.jsonl. Garde seulement ce que
l'utilisateur a tapé (pas les résultats d'outils ni les messages système), trie par date, enlève les doublons et
masque ce qui ressemble à un secret (clé, jeton, IBAN, e-mail, téléphone). Les dates sont en UTC.
"""

import argparse
import glob
import json
import os
import re
import sys

SECRETS = [
    (re.compile(r"\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]){10,30}\b"), "[IBAN masqué]"),
    (re.compile(r"\b(?:sk|pk|rk|appl|goog|ghp|gho|github_pat|xox[bpa]|AKIA|AIza|GOCSPX|eyJ)[-_A-Za-z0-9.]{12,}"), "[clé masquée]"),
    (re.compile(r"-----BEGIN [A-Z ]+-----.*?-----END [A-Z ]+-----", re.S), "[clé privée masquée]"),
    (re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.]+\b"), "[e-mail masqué]"),
    (re.compile(r"(?<!\d)(?:\+?\d[\d .-]{8,}\d)(?!\d)"), "[numéro masqué]"),
    (re.compile(r"\b[A-Za-z0-9_-]{32,}\b"), "[jeton masqué]"),
]

BRUIT = (
    "<",  # balises système, rappels, résultats d'outils
    "This session is being continued",
    "Base directory for this skill",
    "Stop hook feedback",
    "This session's worker process was restarted",
    "[Image:",
)


def dossier_conversations(projet: str) -> str:
    nom = os.path.abspath(projet).replace("/", "-")
    return os.path.join(os.path.expanduser("~/.claude/projects"), nom)


def masquer(texte: str) -> str:
    for motif, remplacement in SECRETS:
        texte = motif.sub(remplacement, texte)
    return texte


def messages(dossier: str):
    for fichier in sorted(glob.glob(os.path.join(dossier, "*.jsonl"))):
        with open(fichier, encoding="utf-8", errors="replace") as f:
            for ligne in f:
                try:
                    entree = json.loads(ligne)
                except json.JSONDecodeError:
                    continue
                if entree.get("type") != "user":
                    continue
                contenu = entree.get("message", {}).get("content")
                textes = [contenu] if isinstance(contenu, str) else [
                    bloc.get("text", "") for bloc in contenu or [] if isinstance(bloc, dict) and bloc.get("type") == "text"
                ]
                for texte in textes:
                    texte = re.sub(r"\s+", " ", texte or "").strip()
                    if not texte or texte.startswith(BRUIT):
                        continue
                    yield entree.get("timestamp", ""), masquer(texte)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("projet", nargs="?", default=os.getcwd(), help="dossier du projet (par défaut : le dossier courant)")
    parser.add_argument("--dossier", help="dossier des conversations, s'il n'est pas trouvé tout seul")
    parser.add_argument("--max", type=int, default=400, help="longueur maximale d'un message affiché (400 par défaut)")
    args = parser.parse_args()

    dossier = args.dossier or dossier_conversations(args.projet)
    if not os.path.isdir(dossier):
        sys.exit(f"Pas de conversations trouvées dans {dossier}. Indique le bon dossier avec --dossier.")

    vus = set()
    for date, texte in sorted(messages(dossier)):
        if texte in vus:
            continue
        vus.add(texte)
        court = texte if len(texte) <= args.max else texte[: args.max] + "…"
        try:
            print(f"{date[:16].replace('T', ' ')} | {court}")
        except BrokenPipeError:  # sortie coupée (ex. | head) : on s'arrête sans erreur
            break


if __name__ == "__main__":
    main()
