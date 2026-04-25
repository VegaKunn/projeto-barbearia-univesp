const fs = require("fs");
const path = require("path");

/**
 * Busca uma palavra dentro dos arquivos do projeto
 * @param {string} dir Diretório inicial
 * @param {string} palavra Palavra a buscar
 * @param {string[]} ignoreDirs Pastas para ignorar
 * @param {string} base Caminho relativo
 * @returns {Array<{file: string, line: number, text: string}>}
 */
function buscarPalavra(dir, palavra, ignoreDirs = [], base = "") {
  let resultados = [];

  const itens = fs.readdirSync(dir);

  for (const item of itens) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(base, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      if (ignoreDirs.includes(item)) continue;

      resultados = resultados.concat(
        buscarPalavra(fullPath, palavra, ignoreDirs, relativePath),
      );
    } else {
      try {
        const conteudo = fs.readFileSync(fullPath, "utf-8");

        const linhas = conteudo.split("\n");

        linhas.forEach((linha, index) => {
          if (linha.toLowerCase().includes(palavra.toLowerCase())) {
            resultados.push({
              file: relativePath,
              line: index + 1,
              text: linha.trim(),
            });
          }
        });
      } catch (err) {
        // Ignora arquivos que não podem ser lidos (binários, etc)
      }
    }
  }

  return resultados;
}

// Exemplo de uso
const ignore = ["node_modules", ".git", "dist", ".github"];
const palavra = "CreepyMemes. All rights reserved.";

const resultados = buscarPalavra(process.cwd(), palavra, ignore);

// Exibir resultados
resultados.forEach((r) => {
  console.log(`${r.file}:${r.line}`);
  console.log(`  ${r.text}`);
});
