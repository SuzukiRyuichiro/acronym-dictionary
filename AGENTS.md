This is a simple static webstie to search commonly used Acronyms in the company.

User can search by the input field, and as they type, it should filter the output. The filtering logic is in /script.js

It supports Japanese and Engilish

Data is based off of /acronyms.json file

example item should look like 
```json
[
  {
    "acronym": "TAM",
    "stands_for": "Total Addressable Market",
    "meaning_ja": "獲得可能な最大市場規模",
    "meaning_en": "Total Addressable Market",
    "explanation_ja": "Total Addressable Market（TAM）は、製品やサービスが市場の100%を獲得できた場合に取得できる最大市場規模を指します。",
    "explanation_en": "Total Addressable Market is the total revenue opportunity that a company can capture for a product or service if it achieved 100% market penetration."
  },
  ....
]
```

Style uses pico.css delivered via the CDN. Documentation found in https://picocss.com/docs

It is deployed to Github Pages.
