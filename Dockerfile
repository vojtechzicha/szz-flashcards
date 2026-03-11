FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile

COPY index.html /srv/
COPY styles.css /srv/
COPY app.js /srv/
COPY flashcards.js /srv/
COPY sw.js /srv/
COPY manifest.json /srv/
COPY icons/ /srv/icons/
