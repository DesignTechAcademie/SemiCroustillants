#!/usr/bin/env python

import pygame
pygame.mixer.init()
pygame.mixer.Sound("test.wav").play()
while pygame.mixer.get_busy():
    # lecture en cours
    pass