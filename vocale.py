#!/usr/bin/env python
# -*- coding: utf-8 -*-

import speechd
client = speechd.SSIPClient('test')

client.set_punctuation(speechd.PunctuationMode.SOME)

client.speak("Coucou : tout le monde.")
client.speak("Comment allez vous les amis ?")

client.close()
