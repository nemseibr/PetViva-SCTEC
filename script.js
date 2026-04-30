// ================================
// SACOLA DE COMPRAS PROFISSIONAL
// ================================

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function adicionar(nome, preco, qtd = 1) {
  const item = carrinho.find(i => i.nome === nome);
  if (item) {
    item.qtd += qtd;
  } else {
    carrinho.push({ nome, preco, qtd: qtd });
  }
  salvarCarrinho();
  atualizarSacola();
  atualizarBadge();
}

function removerItem(index) {
  if (carrinho[index].qtd > 1) {
    carrinho[index].qtd--;
  } else {
    carrinho.splice(index, 1);
  }
  salvarCarrinho();
  atualizarSacola();
  atualizarBadge();
}

function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarBadge() {
  const totalItens = carrinho.reduce((sum, item) => sum + item.qtd, 0);
  document.getElementById('badge').textContent = totalItens;
}

function abrirSacola() {
  document.getElementById('overlay').classList.add('ativo');
  atualizarSacola();
}

function fecharSacola() {
  document.getElementById('overlay').classList.remove('ativo');
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  atualizarBadge();
  document.getElementById('btn-sacola').addEventListener('click', abrirSacola);
  renderizarProdutos();
  renderizarPromocoes();
});

function atualizarSacola() {
  const lista = document.getElementById('lista-sacola');
  const totalEl = document.getElementById('total');
  const finalizarBtn = document.querySelector('.btn-finalizar');
  
  if (carrinho.length === 0) {
    lista.innerHTML = '<div class="vazia">Sua sacola está vazia<br><small>Adicione produtos para continuar</small></div>';
    totalEl.textContent = 'Total: R$ 0,00';
    finalizarBtn.disabled = true;
    return;
  }
  
  let total = 0;
  lista.innerHTML = carrinho.map((item, index) => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;
    return `
      <div class="item-sacola">
        <div class="item-info">
          <div class="item-nome">${item.nome}</div>
          <div class="item-preco">R$ ${item.preco.toFixed(2).replace('.', ',')} und</div>
        </div>
        <div class="item-qtd">x${item.qtd}</div>
        <button class="btn-remover" onclick="removerItem(${index})">−</button>
      </div>
    `;
  }).join('');
  
  totalEl.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
  finalizarBtn.disabled = false;
}

document.getElementById('overlay').addEventListener('click', (e) => {
  if (e.target.id === 'overlay') fecharSacola();
}); 

// ========================
// FINALIZAR COMPRA
// ========================

function finalizarCompra() {
  const nome = document.getElementById("cliente-nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const estado = document.getElementById("estado").value;
  const cep = document.getElementById("cep").value.trim();

  if (!nome || !endereco || !estado || !cep) {
    alert("Preencha todos os campos!");
    return;
  }

  document.getElementById("msg-compra").textContent = "Pagamento realizado com sucesso!";
  carrinho = [];
  salvarCarrinho();
  atualizarSacola();
  atualizarBadge();
  
  setTimeout(() => {
    fecharSacola();
    document.getElementById("msg-compra").textContent = "";
  }, 3000);
}

// ========================
// PRODUTOS
// ========================

class Produto {
  constructor(nome, preco, imagem) {
    this.nome = nome;
    this.preco = preco;
    this.imagem = imagem;
  }
  descricao() { return "Produto para seu pet"; }
  precoFormatado() {
    return this.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
}

class ProdutoPeso extends Produto {
  constructor(nome, preco, imagem, peso) {
    super(nome, preco, imagem);
    this.peso = peso;
  }
  descricao() { return `Peso: ${this.peso}kg`; }
}

const listaPromo = [
  new ProdutoPeso("Ração Canina", 47.35, "imgprodutos/imgsdog/racao1cao.png", 3),
  new Produto("Vermífugo para gatos", 55.00, "imgprodutos/imgsgato/vermifugoGato.png"),
  new Produto("Aquário Curvo 45L", 1100.99, "imgprodutos/imgpeixe/aquario.png"),
];

const produtos = [
  { nome: "Gaiola Coelho", preco: 241.00, imagem: "imgprodutos/imgcoelho/acessorioCoelho.png", categoria: "acessorios", tipo: "coelho" },
  { nome: "Viveiro Passarinho", preco: 1500.00, imagem: "imgprodutos/imgpassarinho/acessoriopassarinho.png", categoria: "acessorios", tipo: "passarinho" },
  { nome: "Ração para Peixe Betta", preco: 17.00, imagem: "imgprodutos/imgpeixe/racaopeixe.png", categoria: "racao", tipo: "peixe" },
  { nome: "Casa para Cachorro Tam. M", preco: 60.00, imagem: "imgprodutos/imgsdog/acessoriocao.png", categoria: "acessorios", tipo: "cachorro" },
  { nome: "Remédio contra Carrapato e Pulgas", preco: 54.37, imagem: "imgprodutos/imgsdog/farmaciacao.png", categoria: "farmacia", tipo: "cachorro" },
  { nome: "Ração Premier Nattu 10,1Kg", preco: 93.82, imagem: "imgprodutos/imgsdog/racao2cao.png", categoria: "racao", tipo: "cachorro" },
  { nome: "Arranhador de Papelão", preco: 45.99, imagem: "imgprodutos/imgsgato/acessorioGato.png", categoria: "acessorios", tipo: "gato" },
  { nome: "Sachê Gran Plus", preco: 6.87, imagem: "imgprodutos/imgsgato/racaoGato.png", categoria: "racao", tipo: "gato" },
  { nome: "Ração Reptolife", preco: 21.46, imagem: "imgprodutos/imgtartaruga/racaotartaruga.png", categoria: "racao", tipo: "tartaruga" }
];

function renderizarPromocoes() {
  document.getElementById("produtos").innerHTML = listaPromo.map((p, index) => `
    <div class="produto">
      <img src="${p.imagem}">
      <h3>${p.nome}</h3>
      <p>${p.descricao()}</p>
      <p><strong>${p.precoFormatado()}</strong></p>
      <input type="number" min="1" value="1" id="qtd-promo-${index}" style="width: 50px; margin-bottom: 5px;">
      <button onclick="comprarDoCatalogo(${index}, '${p.nome}', ${p.preco}, 'promo')">Adicionar à sacola</button>
    </div>
  `).join("");
}

function renderizarProdutos(listaFiltrada = produtos) {
  const container = document.getElementById("lista-produtos");
  
  // RESTAURADO: Mensagem de produto indisponível
  if (listaFiltrada.length === 0) {
    container.innerHTML = `<p class="vazia">Produto indisponível</p>`;  
    return;
  }

  container.innerHTML = listaFiltrada.map((p, index) => `
    <div class="produto">
      <img src="${p.imagem}">
      <h3>${p.nome}</h3>
      <p><strong>${p.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></p>
      <input type="number" min="1" value="1" id="qtd-geral-${index}" style="width: 50px; margin-bottom: 5px;">
      <button onclick="comprarDoCatalogo(${index}, '${p.nome}', ${p.preco}, 'geral')">Adicionar à sacola</button>
    </div>
  `).join("");
}

function comprarDoCatalogo(index, nome, preco, tipo) {
  const input = document.getElementById(tipo === 'promo' ? `qtd-promo-${index}` : `qtd-geral-${index}`);
  const qtd = parseInt(input.value);
  if (qtd >= 1) {
    adicionar(nome, preco, qtd);
    input.value = 1;
  }
}

function filtrarProdutos(tipo, categoria) {
  const filtrados = produtos.filter(p => p.tipo === tipo && p.categoria === categoria);
  renderizarProdutos(filtrados);
  document.getElementById("secao-produtos").scrollIntoView({ behavior: "smooth" });
}

// ============================
// FORMULÁRIO (RESTAURADO)
// ============================

const nomeF = document.getElementById("nome");
const emailF = document.getElementById("email");
const msgF = document.getElementById("msg");
const btnF = document.getElementById("enviar");

const erroNome = document.getElementById("erro-nome");
const erroEmail = document.getElementById("erro-email");
const erroMsg = document.getElementById("erro-msg");
const sucesso = document.getElementById("sucesso");

function validarNome() {
  const valido = nomeF.value.trim().length >= 2;
  nomeF.classList.toggle("input-erro", !valido);
  nomeF.classList.toggle("input-ok", valido);
  erroNome.style.display = valido ? "none" : "block";
  return valido;
}

function validarEmail() {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valido = regex.test(emailF.value);
  emailF.classList.toggle("input-erro", !valido);
  emailF.classList.toggle("input-ok", valido);
  erroEmail.style.display = valido ? "none" : "block";
  return valido;
}

function validarMsg() {
  const valido = msgF.value.trim().length >= 5;
  msgF.classList.toggle("input-erro", !valido);
  msgF.classList.toggle("input-ok", valido);
  erroMsg.style.display = valido ? "none" : "block";
  return valido;
}

function validarForm() {
  const ok = validarNome() & validarEmail() & validarMsg();
  btnF.disabled = !ok;
}

nomeF.addEventListener("input", validarForm);
emailF.addEventListener("input", validarForm);
msgF.addEventListener("input", validarForm);

btnF.addEventListener("click", (e) => {
  e.preventDefault();
  if (btnF.disabled) return;
  
  btnF.classList.add("loading");
  btnF.textContent = "Enviando...";

  setTimeout(() => {
    sucesso.style.display = "block";
    sucesso.textContent = "Solicitação de contato enviada com sucesso!";
    nomeF.value = ""; emailF.value = ""; msgF.value = "";
    btnF.textContent = "Enviar";
    btnF.classList.remove("loading");
    btnF.disabled = true;
    document.querySelectorAll(".input-ok").forEach(el => el.classList.remove("input-ok"));
    setTimeout(() => { sucesso.style.display = "none"; }, 5000);
  }, 1500);
});

// ========================
// MODAL SERVIÇOS E BUSCA
// ========================

const servicos = {
  vet: { titulo: "Veterinário", texto: "Atendimento completo para garantir a saúde e o bem-estar do seu pet em todas as fases da vida. Contamos com profissionais qualificados para consultas, orientações e cuidados preventivos. Nosso foco é oferecer segurança, carinho e acompanhamento de qualidade. Aqui, seu pet é tratado com respeito e atenção. Clique no botão e fale com um de nossos atendentes agora mesmo!" },
  leva: { titulo: "Leva e Traz", texto: "Pensando na sua comodidade, oferecemos o serviço de leva e traz para buscar e entregar seu pet com total segurança. Ideal para quem tem uma rotina corrida ou dificuldade de locomoção. Garantimos um transporte cuidadoso e confortável. Mais praticidade para você, mais tranquilidade para seu pet. Clique no botão e fale com um de nossos atendentes agora mesmo!" },
  adote: { titulo: "Adote um Pet", texto: "Conectamos você a animais que precisam de um lar cheio de amor e cuidado. Trabalhamos com responsabilidade, incentivando a adoção consciente. Todos os pets disponíveis passam por cuidados básicos antes de encontrar uma nova família. Adotar é um ato de amor que transforma vidas. Clique no botão e fale com um de nossos atendentes agora mesmo!" },
  plano: { titulo: "Plano de Saúde Pet", texto: "Oferecemos planos acessíveis para cuidar da saúde do seu pet de forma contínua. Com acompanhamento regular, você evita surpresas e garante mais qualidade de vida ao seu companheiro. Inclui consultas, orientações e benefícios exclusivos. Mais cuidado, prevenção e economia no dia a dia. Clique no botão e fale com um de nossos atendentes agora mesmo!" }
};

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    const tipo = card.dataset.servico;
    document.getElementById("modal-titulo").textContent = servicos[tipo].titulo;
    document.getElementById("modal-texto").textContent = servicos[tipo].texto;
    document.getElementById("modal").classList.add("ativo");
  });
});

document.getElementById("fechar").addEventListener("click", () => {
  document.getElementById("modal").classList.remove("ativo");
});

document.querySelector(".busca button").addEventListener("click", () => {
  const termo = document.querySelector(".busca input").value.toLowerCase().trim();
  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo) || p.tipo.toLowerCase().includes(termo) || p.categoria.toLowerCase().includes(termo));
  renderizarProdutos(filtrados);
  document.getElementById("secao-produtos").scrollIntoView({ behavior: "smooth" });
});

// ========================
// BUSCA (EVENTO DE ENTER AQUI)
// ========================

const campoBusca = document.querySelector(".busca input");
const botaoBusca = document.querySelector(".busca button");


botaoBusca.addEventListener("click", () => {
  const termo = campoBusca.value.toLowerCase().trim();
  const filtrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(termo) || 
    p.tipo.toLowerCase().includes(termo) || 
    p.categoria.toLowerCase().includes(termo)
  );
  renderizarProdutos(filtrados);
  document.getElementById("secao-produtos").scrollIntoView({ behavior: "smooth" });
});


campoBusca.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    botaoBusca.click(); 
  }
});


