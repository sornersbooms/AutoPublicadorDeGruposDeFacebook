const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const credenciales = require('./credenciales.json');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navegar a la página de inicio de sesión de Facebook
    await page.goto('https://www.facebook.com/');

    // Ingresar el correo electrónico
    await page.type('#email', credenciales.email);

    // Ingresar la contraseña
    await page.type('#pass', credenciales.contraseña);

    // Hacer clic en el botón de inicio de sesión
    await page.click('button[name="login"]');

    // Esperar 15 segundos
    await new Promise(resolve => setTimeout(resolve, 15000));

    // Leer el archivo grupos.txt
    const gruposTexto = await fs.readFile('grupos.txt', 'utf-8');
    const enlaces = gruposTexto.split('\n').filter(enlace => enlace.trim()); // Separar los enlaces por salto de línea y eliminar espacios en blanco

    // Publicar en cada grupo
    for (const enlace of enlaces) {
        // Navegar al grupo
        await page.goto(enlace);
        await new Promise(resolve => setTimeout(resolve, 15000)); // Esperar 30 segundos

        // Hacer clic en el campo de publicación
        try {
            await page.click('div.xi81zsa.x1lkfr7t.xkjl1po.x1mzt3pk.xh8yej3.x13faqbe');
        } catch (error) {
            console.error(`Error al intentar hacer clic en el campo de publicación para ${enlace}: ${error.message}`);
            continue; // Continuar con el siguiente enlace
        }

        // Escribir el mensaje usando page.evaluate
        await page.waitForSelector('div._1mj');
        await page.type('div._1mj', credenciales.mensaje);
        // Esperar después de escribir
        await new Promise(resolve => setTimeout(resolve, 5000)); // Esperar 5 segundos

        // Hacer clic en el botón de publicar
        await page.waitForSelector('div[aria-label="Publicar"]', { timeout: 15000 });
        await page.click('div[aria-label="Publicar"]'); // Selector del botón de publicar

        // Esperar a que se complete la publicación
        await new Promise(resolve => setTimeout(resolve, 15000)); // Esperar 15 segundos

        console.log(`✅ Publicación exitosa en: ${enlace}`);
    }


})();