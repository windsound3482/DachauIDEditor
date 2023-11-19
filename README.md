# DachauIDEditor
Don't have imagemagick yet ?
Follow this guide [https://github.com/Ilyes-El-Majouti/pdftopic/blob/main/docs/dependencies-installation.md] to install the required dependencies.
remember the right for PDF should be enabled here like described here:https://stackoverflow.com/a/59193253
just remove this whole following section from /etc/ImageMagick-6/policy.xml:

<!-- disable ghostscript format types -->
<policy domain="coder" rights="none" pattern="PS" />
<policy domain="coder" rights="none" pattern="PS2" />
<policy domain="coder" rights="none" pattern="PS3" />
<policy domain="coder" rights="none" pattern="EPS" />
<policy domain="coder" rights="none" pattern="PDF" />
<policy domain="coder" rights="none" pattern="XPS" />

for docx support
sudo apt-get install libreoffice libreoffice-l10n-de libreoffice-help-de 