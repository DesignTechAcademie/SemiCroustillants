#!/usr/bin/env python
import subprocess
import pygame


			#pico2wave -l fr-FR -w $.wav "$";
subprocess.call(["pico2wave", "-l", "fr-FR", "-w", "$.wav", "\"$\";"])

pygame.mixer.init()
pygame.mixer.Sound("bonjour.wav").play()

pygame.mixer.Sound("$.wav").play()
while pygame.mixer.get_busy():
    # lecture en cours
    pass
