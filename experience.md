markdown
---
layout: default
title: Work Experience
---

# Work Experience

{% for job in site.data.resume.experience %}
## {{ job.title }}
### {{ job.company }}
*{{ job.duration }}*

{% for responsibility in job.responsibilities %}
- {{ responsibility }}
{% endfor %}

{% endfor %}