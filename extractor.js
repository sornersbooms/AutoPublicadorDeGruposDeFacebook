const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // Navegar a la página de inicio de sesión de Facebook
    await page.goto('https://www.facebook.com/');

    // Ingresar el correo electrónico
    await page.type('#email', 'programadorblower@gmail.com');

    // Ingresar la contraseña
    await page.type('#pass', 'cristoVIVE...');

    // Hacer clic en el botón de inicio de sesión
    await page.click('button[name="login"]');

    // Promesa de espera de 3 segundos (3000 ms)
    await new Promise(resolve => setTimeout(resolve, 15000));

    // Aquí puedes agregar más acciones después de iniciar sesión

    await page.goto('https://www.facebook.com/groups/joins/');

    // Hacer scroll durante 1 minuto
    const scrollDuration = 60 * 1000; // 1 minuto en milisegundos
    const scrollStep = 100; // milisegundos entre cada scroll
    const endTime = Date.now() + scrollDuration;

    while (Date.now() < endTime) {
        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight);
        });
        await new Promise(resolve => setTimeout(resolve, scrollStep));
    }

    // Extraer todas las URL de los grupos, omitiendo las primeras 6 y eliminando duplicados
    const groupUrls = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="/groups/"]'));
        const uniqueLinks = [...new Set(links.map(link => link.href))]; // Eliminar duplicados
        return uniqueLinks.slice(6); // Omitir las primeras 6 URL
    });

    // Imprimir las URL de los grupos en la consola
    console.log(groupUrls);

    // Guardar las URL en un archivo grupos.txt
    fs.writeFileSync('grupos.txt', groupUrls.join('\n'), 'utf8');


    console.log("✅ extraccion finalizada")




})();
