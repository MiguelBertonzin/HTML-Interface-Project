function searchDrink() {
    // Limpar resultados anteriores
    $('#drinkDetails').html('');

    // Obter o nome da bebida do campo de entrada
    const drinkName = $('#searchInput').val();

    // Verificar se o campo está vazio
    if (drinkName === '') {
        alert('Por favor, digite o nome da bebida.');
        return;
    }

    // Fazer solicitação AJAX para a API thecocktaildb
    $.ajax({
        url: `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`,
        method: 'GET',
        success: function(data) {
            // Verificar se a bebida foi encontrada
            if (data.drinks === null) {
                alert('Bebida não encontrada. Tente novamente.');
            } else {
                // Extrair informações da bebida
                const drink = data.drinks[0];
                const drinkDetails = `
                    <h2>${drink.strDrink}</h2>
                    <img src="${getDrinkThumbnailURL(drink.strDrinkThumb)}" alt="${drink.strDrink}">
                    <p>Ingredientes: ${getIngredients(drink)}</p>
                    <p>Instruções: ${drink.strInstructions}</p>
                `;
                // Exibir informações da bebida
                $('#drinkDetails').html(drinkDetails);
            }
        },
        error: function(error) {
            console.error('Erro na solicitação AJAX:', error);
            alert('Erro ao buscar a bebida. Tente novamente.');
        }
    });
}

function searchByCharacter() {
    const character = $('#searchInput').val().toUpperCase(); // Converte para maiúsculo

    if (character === '') {
        alert('Por favor, digite uma letra ou número.');
        return;
    }

    $('#drinkDetails').html('');

    $.ajax({
        url: `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${character}`,
        method: 'GET',
        success: function(data) {
            if (data.drinks !== null) {
                const drinkList = data.drinks.map(drink => `<li>${drink.strDrink}</li>`).join('');
                $('#drinkDetails').html(`<h2>${character}</h2><ul>${drinkList}</ul>`);
            } else {
                $('#drinkDetails').html(`<h2>Nenhuma bebida encontrada para ${character}</h2>`);
            }
        },
        error: function(error) {
            console.error('Erro na solicitação AJAX:', error);
            alert('Erro ao buscar as bebidas. Tente novamente.');
        }
    });
}


function getDrinkThumbnailURL(imageURL) {
    // Adiciona /preview ao final da URL da imagem da bebida
    return `${imageURL}/preview`;
}

function getIngredients(drink) {
    // Construir a lista de ingredientes
    let ingredients = '';
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredient) {
            ingredients += `${ingredient} ${measure ? `(${measure})` : ''}, `;
        } else {
            break;
        }
    }
    // Remover a vírgula final
    ingredients = ingredients.slice(0, -2);
    return ingredients;
}
