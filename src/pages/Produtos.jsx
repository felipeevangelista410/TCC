import { useState } from 'react'
import img1 from '../assets/image.webp'
import img2 from '../assets/image2.webp'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Produtos.css'

export default function Produtos() {
  const [produtos, setProdutos] = useState([])

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco, setValue] = useState('')
  const [imagemPreview, setImagemPreview] = useState(null)

  useScrollReveal([produtos.length])

  const handleImageChange = (e) => {
    const arquivo = e.target.files[0]
    if (arquivo) {
      const reader = new FileReader()
      reader.onloadend = () => setImagemPreview(reader.result)
      reader.readAsDataURL(arquivo)
    }
  }

  const adicionarProduto = (e) => {
    e.preventDefault()
    const novo = {
      id: Date.now(),
      nome,
      descricao,
      preco,
      imagem: imagemPreview || 'https://via.placeholder.com/150',
    }
    setProdutos([...produtos, novo])

    setNome('')
    setDescricao('')
    setValue('')
    setImagemPreview(null)
  }

  return (
    <main>
      <section className="produtos-hero reveal">
        <div className="container produtos-hero__grid">
          <img src={img1} alt="Prateleiras organizadas da loja" className="img-arredondada" />
          <img src={img2} alt="Atendimento especializado na loja" className="img-arredondada" />
        </div>
      </section>

      <section className="section produtos-cadastro-section">
        <div className="container">
          <div className="admin-cadastro reveal">
            <p className="admin-cadastro__aviso">
              Aviso: essa funcionalidade é temporária e serve para entender a
              organização dos produtos.
            </p>
            <h3>Cadastrar novo produto</h3>
            <form onSubmit={adicionarProduto} className="form-cadastro">
              <label className="campo-cadastro">
                <span>Nome do produto</span>
                <input
                  type="text"
                  placeholder="Ex.: Cimento 50kg"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </label>

              <label className="campo-cadastro">
                <span>Descrição curta</span>
                <input
                  type="text"
                  placeholder="Ex.: Alta resistência"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </label>

              <label className="campo-cadastro">
                <span>Preço</span>
                <input
                  type="number"
                  placeholder="0,00"
                  value={preco}
                  onChange={(e) => setValue(e.target.value)}
                />
              </label>

              <label className="btn-upload">
                {imagemPreview ? '✓ Foto carregada' : 'Selecionar imagem'}
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>

              <button type="submit" className="btn btn--primary btn-salvar">
                Adicionar à lista
              </button>
            </form>
          </div>

          <div className="produtos-header reveal">
            <h1>Produtos</h1>
            <div className="filtros">
              <button type="button">
                Ordenar por tipo: <strong>Mostrar mais ▾</strong>
              </button>
              <button type="button">
                Filtrar produto <span aria-hidden="true">⊶</span>
              </button>
            </div>
          </div>

          <div className="product-grid">
            {produtos.length === 0
              ? [1, 2, 3, 4].map((i) => (
                  <div key={i} className="card-vazio reveal" aria-hidden="true" />
                ))
              : produtos.map((p) => (
                  <div key={p.id} className="card-produto-real reveal">
                    <img src={p.imagem} alt={p.nome} />
                    <div className="card-info">
                      <h4>{p.nome}</h4>
                      <p>{p.descricao}</p>
                      <p>R$ {p.preco}</p>
                    </div>
                  </div>
                ))}
          </div>

          <div className="pagination-area">
            <p>Você viu {produtos.length} de 100 produtos</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${produtos.length}%` }} />
            </div>
            <button type="button" className="btn btn--outline btn-ver-mais">
              Ver mais
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
