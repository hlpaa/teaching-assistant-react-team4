Feature: Cadastro de roteiros

  Scenario: Cadastrar um roteiro com dados válidos
    Given que não existe um roteiro com title "Roteiro 1"
    When eu envio um POST para "/api/scripts" com title "Roteiro 1"
    Then o status da resposta é 201
    And ao consultar GET "/api/scripts" eu vejo um roteiro com title "Roteiro 1"