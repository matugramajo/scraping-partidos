const puppeteer = require('puppeteer');

const scrapePartidos = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const partidos = await page.evaluate(() => {
    const tableRows = Array.from(
      document.querySelectorAll('table.wikitable.infobox_matches_content tbody tr')
    );
    return tableRows
      .map((row) => {
        const rivalElement = row.querySelector('.team-right .team-template-text a');
        const rivalLogoElement = row.querySelector('.team-right img');
        const matchDateElement = row.querySelector('.match-filler .timer-object-date');

        if (rivalElement && rivalLogoElement && matchDateElement) {
          return {
            rivalName: rivalElement.textContent.trim(),
            rivalLogoUrl: rivalLogoElement.src,
            matchDate: new Date(matchDateElement.textContent.trim()),
          };
        }
        return null;
      })
      .filter((match) => match !== null);
  });

  await browser.close();
  return partidos;
};

module.exports = { scrapePartidos };  // Asegúrate de exportar correctamente
