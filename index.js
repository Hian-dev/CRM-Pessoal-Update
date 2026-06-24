
/*************************************************
 CONFIGURAÇÕES
*************************************************/

const API_URL =
"https://script.google.com/macros/s/AKfycbw97wcVFRLyXFzeKaGKVNwJH3p3xJcsNzrixtA8smnN9H1_rnoF1X5qChsCIl9cY0ba/exec";

const TOKEN =
"hian2002";

/*************************************************
 INICIALIZAÇÃO
*************************************************/

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await carregarCursos();

        await carregarDashboard();

        await carregarAlunos();

        document
        .getElementById("formCadastro")
        .addEventListener(
            "submit",
            cadastrarAluno
        );

    }
);

/*************************************************
 DASHBOARD
*************************************************/

async function carregarDashboard(){

    try{

        const resposta =
        await fetch(
            `${API_URL}?action=dashboard&token=${TOKEN}`
        );

        const dados =
        await resposta.json();

        document.getElementById(
            "totalAlunos"
        ).innerText =
        dados.total || 0;

        document.getElementById(
            "novosLeads"
        ).innerText =
        dados.novos || 0;

        document.getElementById(
            "matriculados"
        ).innerText =
        dados.matriculados || 0;

        document.getElementById(
            "cancelados"
        ).innerText =
        dados.cancelados || 0;

    }
    catch(error){

        console.error(error);

    }

}

/*************************************************
 CURSOS
*************************************************/
 

/*async function carregarCursos(){

    try{

        console.log("Carregando cursos...");

        const resposta = await fetch(
            `${API_URL}?action=cursos&token=${TOKEN}`
        );

        console.log("Status:", resposta.status);

        const cursos = await resposta.json();

        console.log("Cursos:", cursos);

        const selectCurso =
            document.getElementById("curso");

        selectCurso.innerHTML =
            '<option value="">Selecione</option>';

        cursos.forEach(curso => {

            selectCurso.innerHTML +=
            `<option value="${curso}">
                ${curso}
            </option>`;

        });

    }
    catch(error){

        console.error(
            "Erro ao carregar cursos:",
            error
        );

    }

}*/


async function carregarCursos(){

    try{

        const resposta =
        await fetch(
            `${API_URL}?action=cursos&token=${TOKEN}`
        );

        const cursos =
        await resposta.json();

        const selectCurso =
        document.getElementById(
            "curso"
        );

        const filtroCurso =
        document.getElementById(
            "filtroCurso"
        );

        const editCurso =
        document.getElementById(
            "editCurso"
        );

        selectCurso.innerHTML =
        '<option value="">Selecione</option>';

        filtroCurso.innerHTML =
        '<option value="">Todos os Cursos</option>';

        editCurso.innerHTML = '';

        cursos.forEach(curso => {

            selectCurso.innerHTML +=
            `<option value="${curso}">
                ${curso}
            </option>`;

            filtroCurso.innerHTML +=
            `<option value="${curso}">
                ${curso}
            </option>`;

            editCurso.innerHTML +=
            `<option value="${curso}">
                ${curso}
            </option>`;

        });

    }
    catch(error){

        console.error(error);

    }

}

/*************************************************
 CADASTRO
*************************************************/

async function cadastrarAluno(event){

    event.preventDefault();

    const dados = {

        action: "create",

        token: TOKEN,

        nome:
        document.getElementById(
            "nome"
        ).value,

        telefone:
        document.getElementById(
            "telefone"
        ).value,

        email:
        document.getElementById(
            "email"
        ).value,

        curso:
        document.getElementById(
            "curso"
        ).value,

        status:
        document.getElementById(
            "status"
        ).value,

        observacoes:
        document.getElementById(
            "observacoes"
        ).value

    };

    try{

        const resposta =
        await fetch(
            API_URL,
            {
                
                method: "POST",
                body: JSON.stringify(
                    dados
                )
            }
        );

        const resultado =
        await resposta.json();

        if(resultado.sucesso){

            document
            .getElementById("mensagem")
            .innerHTML =
            `Aluno cadastrado.
             ID: ${resultado.id}`;

            document
            .getElementById(
                "formCadastro"
            )
            .reset();

            await carregarDashboard();

            await carregarAlunos();

        }

    }
    catch(error){

        console.error(error);

        alert(
            "Erro ao cadastrar aluno."
        );

    }

}

/*************************************************
 LISTAGEM
*************************************************/

async function carregarAlunos(){

    try{

        const resposta =
        await fetch(
            `${API_URL}?action=alunos&token=${TOKEN}`
        );

        const alunos =
        await resposta.json();

        renderizarTabela(
            alunos
        );

    }
    catch(error){

        console.error(error);

    }

}

function renderizarTabela(alunos){

    const tbody =
    document.getElementById(
        "listaAlunos"
    );

    tbody.innerHTML = "";

    alunos.forEach(aluno => {

        tbody.innerHTML += `
        <tr>

            <td>${aluno.id}</td>

            <td>${aluno.nome}</td>

            <td>${aluno.telefone}</td>

            <td>${aluno.email}</td>

            <td>${aluno.curso}</td>

            <td>${aluno.status}</td>

            <td>

                <button
                    onclick="editarAluno('${aluno.id}')"
                >
                    Editar
                </button>

            </td>

        </tr>
        `;

    });

}

/*************************************************
 BUSCA
*************************************************/

async function buscarAlunos(){

    const termo =
    document.getElementById(
        "campoBusca"
    ).value.trim();

    const curso =
    document.getElementById(
        "filtroCurso"
    ).value;

    const status =
    document.getElementById(
        "filtroStatus"
    ).value;

    try{

        const resposta =
        await fetch(
            `${API_URL}?action=buscar&termo=${encodeURIComponent(termo)}&token=${TOKEN}`
        );

        let alunos =
        await resposta.json();

        if(curso){

            alunos =
            alunos.filter(
                a =>
                a.curso === curso
            );

        }

        if(status){

            alunos =
            alunos.filter(
                a =>
                a.status === status
            );

        }

        renderizarTabela(
            alunos
        );

    }
    catch(error){

        console.error(error);

    }

}

function limparBusca(){

    document.getElementById(
        "campoBusca"
    ).value = "";

    document.getElementById(
        "filtroCurso"
    ).value = "";

    document.getElementById(
        "filtroStatus"
    ).value = "";

    carregarAlunos();

}

/*************************************************
 MODAL
*************************************************/

function abrirModal(){

    document.getElementById(
        "modalEditar"
    ).style.display =
    "block";

}

function fecharModal(){

    document.getElementById(
        "modalEditar"
    ).style.display =
    "none";

}

/*************************************************
 EDIÇÃO
*************************************************/

async function editarAluno(id){

    try{

        const resposta =
        await fetch(
            `${API_URL}?action=aluno&id=${id}&token=${TOKEN}`
        );

        const aluno =
        await resposta.json();

        document.getElementById(
            "editId"
        ).value =
        aluno.id;

        document.getElementById(
            "editNome"
        ).value =
        aluno.nome;

        document.getElementById(
            "editTelefone"
        ).value =
        aluno.telefone;

        document.getElementById(
            "editEmail"
        ).value =
        aluno.email;

        document.getElementById(
            "editCurso"
        ).value =
        aluno.curso;

        document.getElementById(
            "editStatus"
        ).value =
        aluno.status;

        document.getElementById(
            "editObservacoes"
        ).value =
        aluno.observacoes;

        abrirModal();

    }
    catch(error){

        console.error(error);

    }

}

async function salvarEdicao(){

    const dados = {

        action: "update",

        token: TOKEN,

        id:
        document.getElementById(
            "editId"
        ).value,

        nome:
        document.getElementById(
            "editNome"
        ).value,

        telefone:
        document.getElementById(
            "editTelefone"
        ).value,

        email:
        document.getElementById(
            "editEmail"
        ).value,

        curso:
        document.getElementById(
            "editCurso"
        ).value,

        status:
        document.getElementById(
            "editStatus"
        ).value,

        observacoes:
        document.getElementById(
            "editObservacoes"
        ).value

    };

    try{

        const resposta =
        await fetch(
            API_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                    "application/json"
                },
                body: JSON.stringify(
                    dados
                )
            }
        );

        const resultado =
        await resposta.json();

        if(resultado.sucesso){

            fecharModal();

            await carregarAlunos();

            await carregarDashboard();

            alert(
                "Aluno atualizado."
            );

        }

    }
    catch(error){

        console.error(error);

        alert(
            "Erro ao atualizar."
        );

    }

}
