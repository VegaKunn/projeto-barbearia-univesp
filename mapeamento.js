const fs = require("fs");
const path = require("path");

/**
 * Lista estrutura do projeto em formato simples
 * @param {string} dir Diretório inicial
 * @param {string[]} ignoreDirs Pastas para ignorar
 * @param {string} base Caminho base relativo
 * @returns {string[]}
 */
function listarEstrutura(dir, ignoreDirs = [], base = "") {
  let resultado = [];

  const itens = fs.readdirSync(dir);

  for (const item of itens) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(base, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      if (ignoreDirs.includes(item)) continue;

      // adiciona pasta com /
      resultado.push(relativePath + "/");

      // recursão
      resultado = resultado.concat(
        listarEstrutura(fullPath, ignoreDirs, relativePath),
      );
    } else {
      // adiciona arquivo
      resultado.push(relativePath);
    }
  }

  return resultado;
}

// Exemplo de uso
const ignore = ["node_modules", ".git", "dist", ".github"];

const estrutura = listarEstrutura(process.cwd(), ignore);

// imprime linha por linha
estrutura.forEach((linha) => console.log(linha));
