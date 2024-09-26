import React, { useState } from 'react';
import './App.css';

//imagem
interface Imagem {
  id: number;
  url: string;
  descricao?: string; //descrição opcional
}

const App: React.FC = () => {
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [descricao, setDescricao] = useState('');
  const [imagemURLs, setImagemURLs] = useState<FileList | null>(null); 
  const [previews, setPreviews] = useState<string[]>([]); // pré-visualizações

  // adicionar imagens
  const adicionarImagens = () => {
    if (imagemURLs) {
      const novasImagens: Imagem[] = [];
      Array.from(imagemURLs).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const novaImagem: Imagem = {
            id: Date.now() + Math.random(), 
            url: reader.result as string,
            descricao: descricao || '',
          };
          novasImagens.push(novaImagem);
          if (novasImagens.length === imagemURLs.length) {
            setImagens((prevImagens) => [...prevImagens, ...novasImagens]);
            setImagemURLs(null);
            setPreviews([]);
            setDescricao('');
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // selecionar arquivos
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImagemURLs(files);
      const newPreviews: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setPreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // remover imagem
  const removerImagem = (id: number) => {
    setImagens(imagens.filter((imagem) => imagem.id !== id));
  };

  return (
    <div className="container">
      <h1>Galeria de Fotos</h1>

      <div className="formulario">
        <button className="botao-upload" onClick={() => document.getElementById('fileInput')?.click()}>
          Clique para selecionar imagens
        </button>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          multiple
          style={{ display: 'none' }}
        />
        <input
          type="text"
          placeholder="Descrição (opcional)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="botao-descricao"
        />
        <button onClick={adicionarImagens}>Adicionar Imagens</button>
      </div>

      <div className="preview-container">
        {previews.map((preview, index) => (
          <img key={index} src={preview} alt="Pré-visualização" className="preview-imagem" style={{ width: '100px', height: 'auto' }} />
        ))}
      </div>

      <div className="galeria">
        {imagens.map((imagem) => (
          <div key={imagem.id} className="item-galeria">
            <img src={imagem.url} alt={imagem.descricao} />
            <p>{imagem.descricao}</p>
            <button onClick={() => removerImagem(imagem.id)}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
