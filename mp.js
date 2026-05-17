const fs = require("fs");
const path = require("path");

/**
 * Busca e substitui uma frase dentro dos arquivos do projeto
 * @param {string} dir Diretório inicial
 * @param {string} frase Frase a buscar
 * @param {string} novaFrase Frase para substituir
 * @param {string[]} ignoreDirs Pastas para ignorar
 * @param {string} base Caminho relativo
 * @returns {Array<{file: string, line: number, text: string}>}
 */
function buscarESubstituir(dir, frase, novaFrase, ignoreDirs = [], base = "") {
  let resultados = [];

  const itens = fs.readdirSync(dir);

  for (const item of itens) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(base, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      if (ignoreDirs.includes(item)) continue;

      resultados = resultados.concat(
        buscarESubstituir(fullPath, frase, novaFrase, ignoreDirs, relativePath),
      );
    } else {
      try {
        let conteudo = fs.readFileSync(fullPath, "utf-8");
        let alterado = false;

        const linhas = conteudo.split("\n");

        linhas.forEach((linha, index) => {
          if (linha.includes(frase)) {
            resultados.push({
              file: relativePath,
              line: index + 1,
              text: linha.trim(),
            });

            // Substituição (case-insensitive)
            const regex = new RegExp(frase, "gi");
            linhas[index] = linha.replace(regex, novaFrase);
            alterado = true;
          }
        });

        // Só reescreve o arquivo se houve alteração
        if (alterado) {
          fs.writeFileSync(fullPath, linhas.join("\n"), "utf-8");
        }
      } catch (err) {
        // Ignora arquivos não legíveis
      }
    }
  }

  return resultados;
}

// Exemplo de uso
const ignore = ["node_modules", ".git", "dist", ".github"];

const frase = "Credenciais invalidas";
const novaFrase = "Credenciais invalidas";
const resultados = buscarESubstituir(process.cwd(), frase, novaFrase, ignore);

// Exibir resultados
resultados.forEach((r) => {
  console.log(`${r.file}:${r.line}`);
  console.log(`  ${r.text}`);
});
