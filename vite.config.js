import { defineConfig } from 'vite'

export default defineConfig({
  // Substitua 'NOME-DO-REPOSITORIO' pelo nome real do seu projeto no GitHub
  base: '/skyCast/', 
})

// O problema do "Caminho de Casa" (A propriedade base)
// Imagine que seu site no GitHub será: https://seu-usuario.github.io/meu-projeto/.

// Por padrão, o Vite acha que o site vai morar na "raiz" (ex: google.com/). 
// Se ele procurar o arquivo JS em /assets/script.js, 
// ele vai tentar achar em seu-usuario.github.io/assets/... e vai dar erro 404,
//  porque o arquivo está na verdade em /meu-projeto/assets/....

// O que aprendemos: A configuração base: '/nome-do-projeto/' avisa ao Vite: 
// "Ei, coloque o nome da pasta antes de todos os links de imagem, JS e CSS".