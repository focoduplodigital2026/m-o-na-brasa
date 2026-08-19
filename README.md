# Mão na Brasa Burger

Site premium demonstrativo para hamburgueria, criado como vitrine comercial e portfolio da Foco Duplo.

## Como abrir

Abra `index.html` no navegador. O projeto e estatico e roda sem servidor.

## O que esta incluido

- Home cinematografica com imagem gerada para o projeto.
- Cardapio por categorias com produtos, badges e precos promocionais.
- Modal de produto com quantidade, adicionais, observacoes e total dinamico.
- Carrinho lateral com edicao, remocao, subtotal, taxa, desconto e total.
- Checkout em etapas: dados, entrega, pagamento e confirmacao.
- Tela visual de acompanhamento de pedido.
- Promocoes com contador.
- Secoes de sobre, galeria, avaliacoes, Instagram, localizacao e contato.
- Painel administrativo demonstrativo com dashboard, pedidos, produtos, adicionais, promocoes, clientes e configuracoes.
- Painel administrativo editavel com textos do site, configuracoes, produtos, adicionais e avaliacoes salvos no navegador.
- Entrada do admin com email e senha do Supabase Auth.
- Upload de fotos direto da galeria do celular/computador para produtos, galeria do site e bloco do Instagram.
- Area de portfolio da Foco Duplo.
- SEO basico, Open Graph, Schema.org Restaurant, robots.txt e sitemap.xml.

## Observacao tecnica

Esta entrega usa Supabase quando o navegador consegue carregar a SDK via CDN. O admin salva em `settings.site_data` e envia fotos para o bucket `site-images`. Se o Supabase/CDN nao carregar, o site usa `localStorage` como fallback local.
