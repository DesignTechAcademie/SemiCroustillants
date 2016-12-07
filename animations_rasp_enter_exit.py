# Ici nous codons l'animation du raspberry/badgeuse principal, à savoir celui qui se trouvera
# à l'entrée du FabLab.
# Ce qu'il doit faire :
# - quand une personne arrive, elle badge. Le boîtier dit et affiche « Bonjour [nom de l'utilisateur] » et enclenche
# une LED verte
# - quand une personne part, elle badge. Le boîtier dit et affiche « A bientôt [nom de l'utilisateur] » et enclenche
# une LED jaune
# - le boîtier dit et affiche quand l'utilisateur n'est pas à jour de cotisation (LED Rouge).


!/usr/bin/python
coding: utf-8

import RPi.GPIO as GPIO  # Librairie de gestion des entrées/sorties du GPIOs
import time              # Manipulation du temps
import signal            # Permet de gérer les signaux utilisés par le système pour communiquer avec le programme
import sys               # Permet d’interagir avec le système

# Définition des numéros de ports GPIOs
led_rvb =                # [numéro de port à définir au moment du montage de l'appareil], définition du port de la led d'entrée
                         # (vert, jaune et rouge).

GPIO.cleanup()           # Initialisation du GPIOs
GPIO.setmode(GPIO.BCM)   # Choix du mode de numérotation des ports : identique aux inscriptions sur le Cobbler

# Configuration les ports en mode sortie
GPIO.setup(led_rvb, GPIO.OUT)

# Fonction qui éteind la led
def eteindre():
GPIO.output(led_rvb, GPIO.LOW)
