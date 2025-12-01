Feature: Cadastro de roteiros

  Scenario: Cadastrar um roteiro com dados válidos
    Given que estou na página de scripts
    And não existe um roteiro com title "Roteiro 1"
    When eu preencho o campo title com "Roteiro 1"
    And eu clico no botão "Save"
    Then eu vejo que o roteiro "Roteiro 1" foi criado
    And o roteiro aparece na lista de roteiros