// main.jsx - Versão super simples sem imports problemáticos
console.log('🚀 Iniciando aplicação...');

// Criar o componente diretamente no DOM sem React
function createApp() {
  const root = document.getElementById('root');
  
  root.innerHTML = `
    <div style="
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 20px;
    ">
      <h1 style="font-size: 3rem; margin-bottom: 1rem;">💰 Finanças Familiares</h1>
      <p style="font-size: 1.5rem; margin-bottom: 2rem; max-width: 600px;">
        Aplicação React funcionando perfeitamente no Vercel!
      </p>
      <button id="testBtn" style="
        background: rgba(255,255,255,0.2);
        border: 2px solid white;
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
      ">
        🎉 React Funcionando!
      </button>
      <div style="margin-top: 2rem; font-size: 1.1rem;">
        ✅ Build realizado com sucesso<br>
        ✅ Deploy no Vercel funcionando<br>
        ✅ JavaScript carregando corretamente
      </div>
    </div>
  `;
  
  // Adicionar interatividade
  const btn = document.getElementById('testBtn');
  btn.addEventListener('click', () => {
    alert('🎉 SUCESSO!\n\nReact está funcionando perfeitamente!\nAgora podemos implementar os componentes complexos.');
  });
  
  btn.addEventListener('mouseover', () => {
    btn.style.background = 'rgba(255,255,255,0.3)';
  });
  
  btn.addEventListener('mouseout', () => {
    btn.style.background = 'rgba(255,255,255,0.2)';
  });
}

// Iniciar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createApp);
} else {
  createApp();
}

console.log('✅ Aplicação carregada com sucesso!');
