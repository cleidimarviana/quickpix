
/**
* @function
* @name GerarCRC16_CCITT
* @param {*} payload 
* @returns 
* 
* @description 
* O CRC-CCITT (Cyclic Redundancy Check - CCITT) é um algoritmo de verificação de redundância cíclica usado para detectar erros em transmissões de dados. 
* CRC-CCITT refere-se a uma variante específica do CRC-16ts, com valor inicial do CRC (0xFFFF).
*/
function GerarCRC16_CCITT(payload) {
	// Valor inicial do CRC (0xFFFF)
	let crc = 0xFFFF; 

	for (let i = 0; i < payload.length; i++) {
			// Operação XOR entre o byte de dados e o CRC deslocado 8 bits para a esquerda
			crc ^= (payload.charCodeAt(i) << 8); 

			for (let j = 0; j < 8; j++) {
					// Verifica se o bit mais significativo do CRC é 1
					if (crc & 0x8000) { 
							// Desloca o CRC 1 bit para a esquerda e aplica um XOR com o polinômio gerador (0x1021)
							crc = (crc << 1) ^ 0x1021; 
					} else {
							// Desloca o CRC 1 bit para a esquerda
							crc = crc << 1; 
					}
			}
	}
	// Aplica uma operação bitwise "E" entre o valor do CRC e 0xFFFF para manter apenas os 16 bits de menor ordem
	const crcValue = crc & 0xFFFF;
	// Converte o valor do CRC em uma string hexadecimal, utilizando a base 16
	const crcHex = crcValue.toString(16);
	// Converte a string hexadecimal para letras maiúsculas e completa com 0 a esquerda mantendo 4 caracteres
	const crcHexUppercase = crcHex.toUpperCase().padStart(4, '0');        

	// Retorna o valor do código CRC como uma string hexadecimal maiúscula
	return crcHexUppercase;
} 
	function LimpaVariavelDados(valor){
		try{
				return valor.trim();
		}
		catch(ex){
				return valor;
		}
	}
	function ValidaValorNullVarial(valor){
		if(typeof valor == "undefined"){
				return false;
		}
		else if(valor == null){
				return false;
		}
		else if(valor == undefined){
				return false;
		}
		else if(valor.toString() == ""){
				return false;
		}
		else{
				return true;
		}
	}
	function ConvertDouble(valor){
		try{
				if(!ValidaValorNullVarial(valor))
					 return 0;
				else{
						if(isNaN(valor))
								return 0;
						else
								return parseFloat(LimpaVariavelDados(valor));
				}
		}
		catch(ex){
				return 0;
		}
	}
	function formatarNumero(valor, casaDecimais){
		if(!ValidaValorNullVarial(valor))
				return ConvertDouble(0).toFixed(casaDecimais);
		else{
				return ConvertDouble(valor).toFixed(casaDecimais);
		}
	}
	function formatarTamZeroEsquerda(value){
		return value.length.toString().padStart(2, '0');
	}
	
  function GerarQRCodePixEstatico(beneficiario, valor) {
		try {
	
				var tipo = beneficiario.tipo; 
				var chavepix = beneficiario.chave; 
				var usuarioNome = beneficiario.nome; 
				var usuarioCidade = beneficiario.cidade; 
						 
	
				// Validação de parâmetros
				if (!valor || !tipo || !chavepix || !usuarioNome || !usuarioCidade) {
						throw new Error("Todos os parâmetros são obrigatórios e devem estar no formato correto.");
				}
	
				const checkMerchant = {
					cpf: "33",
					cnpj: "36",
					email: "46",
					telefone: "36",
					aleatoria: "58"
				};
			 
				const merchant = checkMerchant[tipo];
	
				// Constantes e variáveis
				const brGov = "BR.GOV.BCB.PIX";
				const transactionCurrency = "986";
				const merchantCategoryCode = "0000";
				const countryCode = "BR";
				//const transactionID = "P00001";
				//const adicional = "PGTO TREVINHO NET";
	
				// Formatação de valores
				const valorFatura = formatarNumero(valor, 2);
				const valorFaturaLength = formatarTamZeroEsquerda(valorFatura);
				const chavepixLength = formatarTamZeroEsquerda(chavepix);
				const usuarioNomeLength = formatarTamZeroEsquerda(usuarioNome);
				const usuarioCidadeLength = formatarTamZeroEsquerda(usuarioCidade);
				const brGovLength = formatarTamZeroEsquerda(brGov);
	
				//const adicionalLength = formatarTamZeroEsquerda(adicional);
	
				// Construção do payload
				const camposPix = [
						["00", "02", "01"], // Payload format indicator
						["26", merchant, ""], // Merchant Account Information 33
						["00", brGovLength, brGov], // Globally Unique Identifier (GUI)
						["01", chavepixLength, chavepix], // Chave Pix
						//["02", adicionalLength, adicional],//  Informações Adicionais
						["52", "04", merchantCategoryCode],
						["53", "03", transactionCurrency],
						["54", valorFaturaLength, valorFatura],
						["58", "02", countryCode],
						["59", usuarioNomeLength, usuarioNome],
						["60", usuarioCidadeLength, usuarioCidade],
						["62", "07", ""], // Additional Data Field Template
						["05", "03", "***"], // Transaction ID (TX ID)
						["63", "04", ""] // Hash CRC-16
				];
	
				const payload = camposPix.reduce((acc, curr) => acc.concat(curr), []).join('');
	
				// Calcula o CRC16 a partir do payload
				const crc16hash = GerarCRC16_CCITT(payload);
	
				// Concatena com o payload para gerar o código Pix estático de pagamento
				return payload + crc16hash;
		} catch (ex) {
				console.error(ex);
				return "";
		}
	}

  function generateQRCode(text){
		QRCode.toCanvas(document.getElementById('qrcode'), text, { width: 360 }, function (error) {
		if (error) {
						console.error(error);
		} else {
						console.log('QR Code gerado com sucesso!');
		}
		});
  }

	function formatarMoeda(valor, simbolo = true) {
		let _simbolo = simbolo ? 'R$ ' : '';
	
		try {
			// Tenta converter o valor para um número float
			let numero = parseFloat(valor);
	
			// Verifica se o valor convertido é um número válido
			if (isNaN(numero)) {
				return _simbolo + '0,00';
			}
	
			// Arredonda o valor para duas casas decimais
			const valorArredondado = numero.toFixed(2);
	
			// Separa o valor inteiro e as casas decimais
			const partes = valorArredondado.split('.');
			let inteiro = partes[0];
			let decimais = partes[1];
	
			// Adiciona o separador de milhares
			inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	
			// Se não houver casas decimais, adiciona duas casas decimais
			if (!decimais) {
				decimais = '00';
			} else if (decimais.length === 1) {
				decimais += '0';
			}
	
			return _simbolo + inteiro + ',' + decimais;
		} catch (error) {
			console.log(error);
			return _simbolo + '0,00';
		}
	}