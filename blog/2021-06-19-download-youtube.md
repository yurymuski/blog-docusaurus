---
slug: other/download-youtube
title: How to Download video from youtube?
author: Yury Muski
author_title: Lead DevOps Engineer / SRE
author_url: https://yurets.pro
author_image_url: https://yurets.pro/avatar.webp
tags: [python]
---

I disided to download my [Highload++ Conference speech](https://www.youtube.com/watch?v=5Qld5krWjvQ&list=PLW-NZsw8bcdJQEcYyTEQNTTnY775l_yW0), but how to do it efficient way?

Fount a great python lib and cmd tool: **pytube** ([github repo](https://github.com/pytube/pytube))

All you need is to install and execute it :)
```sh
pip install --upgrade pytube
pytube 'link'
```

Note: you also can chose the video quality by `pytube --list 'link'; pytube --itag 137 'link'` but it this case you need to **download audio separately**!