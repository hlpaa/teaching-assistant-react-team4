@server
Feature: Server Script Answers Management
  As a system
  I want to manage script answers through the API
  So that student submissions are properly retrieved and updated

  Background:
    Given the server API is available

  # ============================================================
  # Retrieval of all script answers
  # ============================================================

  Scenario: Retrieve all registered script answers
    Given there are script answers registered with IDs "123", "321", "890"
    When I send a GET request to "/api/scripts/answers"
    Then the server should return 200 OK
    And the server should return a list containing answers "123", "321", "890"

  Scenario: Retrieve script answers when none exist
    Given there are no script answers registered
    When I send a GET request to "/api/scripts/answers"
    Then the server should return 200 OK
    And the server should return an empty list

  # ============================================================
  # Retrieval by student (CPF-based)
  # ============================================================

  Scenario: Retrieve answers of a registered student
    Given there is a student with CPF "12345678901"
    And this student has script answers with IDs "40", "41"
    When I send a GET request to "/api/scripts/answers/student/12345678901"
    Then the server should return 200 OK
    And the server should return a list containing answers "40", "41"

  Scenario: Attempt to retrieve answers of a non-existent student
    Given there is no student with CPF "99999999999"
    When I send a GET request to "/api/scripts/answers/student/99999999999"
    Then the server should return 404 Not Found
    And the server should return an error message stating the student was not found

  # ============================================================
  # Retrieval of grade for specific task
  # ============================================================

  Scenario: Retrieve grade of an existing task in an answer
    Given there is a script answer with ID "50"
    And this answer contains a task with ID "2" and grade "MA"
    When I send a GET request to "/api/scripts/answers/50/tasks/2"
    Then the server should return 200 OK
    And the server should return grade "MA"

  Scenario: Attempt to retrieve grade for a missing task
    Given there is a script answer with ID "50"
    And this answer does not contain a task with ID "9"
    When I send a GET request to "/api/scripts/answers/50/tasks/9"
    Then the server should return 404 Not Found
    And the server should return an error message stating the task was not found

  # ============================================================
  # Updating grades
  # ============================================================

  Scenario: Update grade of an existing task with a valid value
    Given there is a script answer with ID "50"
    And this answer contains a task with ID "3" and grade "MANA"
    When I send a PUT request to "/api/scripts/answers/50/tasks/3" with:
      | field | value |
      | grade | MPA   |
    Then the server should return 200 OK
    And the server should update the task grade to "MPA"
    And the server should return the updated grade

  Scenario: Attempt to update grade with an invalid value
    Given there is a script answer with ID "50"
    And this answer contains a task with ID "3"
    When I send a PUT request to "/api/scripts/answers/50/tasks/3" with:
      | field | value |
      | grade | AAA   |
    Then the server should return 400 Bad Request
    And the server should return an error message stating the grade is invalid

  # ============================================================
  # Retrieval by ID
  # ============================================================

  Scenario: Retrieve a script answer by ID
    Given there is a script answer registered with ID "123"
    When I send a GET request to "/api/scripts/answers/123"
    Then the server should return 200 OK
    And the server should return the script answer with ID "123"

  Scenario: Attempt to retrieve a non-existent script answer
    Given there is no script answer registered with ID "777"
    When I send a GET request to "/api/scripts/answers/777"
    Then the server should return 404 Not Found
    And the server should return an error message stating the script answer was not found

  # ============================================================
  # Updating script-level comments
  # ============================================================

  Scenario: Successfully add a comment to a script answer
    Given there is a script answer with ID "50"
    When I send a PUT request to "/api/scripts/answers/50/comments" with:
      | field   | value               |
      | comment | Reveja a explicação |
    Then the server should return 200 OK
    And the server should store the comment in the script answer with ID "50"
    And the server should return the updated comment

  Scenario: Attempt to add a comment to a non-existent script answer
    Given there is no script answer with ID "777"
    When I send a PUT request to "/api/scripts/answers/777/comments" with:
      | field   | value        |
      | comment | Bom trabalho |
    Then the server should return 404 Not Found
    And the server should return an error message stating the script answer was not found

  # ============================================================
  # Updating task-level comments
  # ============================================================

  Scenario: Successfully add a comment to a task inside a script answer
    Given there is a script answer with ID "50"
    And this answer contains a task with ID "3"
    When I send a PUT request to "/api/scripts/answers/50/tasks/3/comments" with:
      | field   | value                                   |
      | comment | Correto, mas poderia detalhar melhor    |
    Then the server should return 200 OK
    And the server should store the comment in task "3"
    And the server should return the updated comment

  Scenario: Attempt to add a comment to a non-existent task inside a script answer
    Given there is a script answer with ID "50"
    And this answer does not contain a task with ID "999"
    When I send a PUT request to "/api/scripts/answers/50/tasks/999/comments" with:
      | field   | value     |
      | comment | Verifique |
    Then the server should return 404 Not Found
    And the server should return an error message stating the task was not found

  Scenario: Attempt to add a comment to a task inside a non-existent script answer
    Given there is no script answer with ID "888"
    When I send a PUT request to "/api/scripts/answers/888/tasks/3/comments" with:
      | field   | value                    |
      | comment | Precisa revisar este ponto |
    Then the server should return 404 Not Found
    And the server should return an error message stating the script answer was not found

    #############
    #############
    #############

  Scenario: Criar um ScriptAnswer quando aluno inicia roteiro
    Given O estudante de CPF "11111111111" está cadastrado no sistema
    And O aluno está matriculado na turma "Math 101-2024-2024"
    And Existe um roteiro de ID "script-001" na turma
    When O aluno cria um ScriptAnswer para o roteiro
    Then O servidor retorna status "201"
    And O ScriptAnswer tem status "in_progress"
    And O campo "started_at" contém um timestamp válido
    And O campo "answers" está vazio

  Scenario: Iniciar resposta de uma questão
    Given O estudante de CPF "11111111111" tem um ScriptAnswer ativo de ID "script-002"
    And A tarefa "task-001" existe no roteiro
    And A tarefa ainda não foi iniciada
    When O aluno inicia a resposta da tarefa "task-001"
    Then O servidor retorna status "201"
    And A TaskAnswer tem status "started"
    And O campo "started_at" contém timestamp válido
    And O campo "submitted_at" está vazio

  Scenario: Enviar resposta de uma questão que não é a última
    Given O estudante de CPF "11111111111" tem um ScriptAnswer ativo
    And A tarefa "task-001" foi iniciada
    And A tarefa não é a última do roteiro
    When O aluno submete a resposta "Minha resposta aqui" para a tarefa
    Then O servidor retorna status "200"
    And A TaskAnswer tem status "submitted"
    And O campo "submitted_at" contém timestamp válido
    And O campo "time_taken_seconds" é calculado corretamente
    And O ScriptAnswer continua com status "in_progress"

  Scenario: Enviar resposta da última questão e finalizar roteiro
    Given O estudante de CPF "11111111111" tem um ScriptAnswer ativo
    And A tarefa "task-003" foi iniciada
    And A tarefa é a última do roteiro
    When O aluno submete a resposta "Resposta final" para a tarefa
    Then O servidor retorna status "200"
    And A TaskAnswer tem status "submitted"
    And O ScriptAnswer tem status "finished"
    And O campo "finished_at" do ScriptAnswer contém timestamp válido

  Scenario: Marcar roteiro como expirado por timeout
    Given O estudante de CPF "11111111111" tem um ScriptAnswer ativo
    And Passaram-se 3601 segundos desde o início
    When O sistema verifica timeout do ScriptAnswer
    Then O servidor retorna status "200"
    And O ScriptAnswer tem status "finished"
    And Todas as tarefas "started" foram marcadas como "submitted"
    And Todas as tarefas "pending" foram marcadas como "timed_out"

  Scenario: Falha ao criar ScriptAnswer para aluno não matriculado
    Given O estudante de CPF "99999999999" está cadastrado no sistema
    And O aluno NÃO está matriculado na turma "Math 101-2024-2024"
    And Existe um roteiro de ID "script-001" na turma
    When O aluno tenta criar um ScriptAnswer para o roteiro
    Then O servidor retorna status "403"
    And A mensagem de erro indica "Student is not enrolled in this class"
    
    Scenario: Falha ao submeter tarefa já submetida
    Given O estudante de CPF "11111111111" tem um ScriptAnswer ativo
    And A tarefa "task-001" já foi submetida
    When O aluno tenta submeter novamente a tarefa "task-001" com resposta "Resposta duplicada"
    Then O servidor retorna status "409"
    And A mensagem de erro indica "Task answer already submitted and cannot be changed"

    Scenario: Buscar ScriptAnswers de uma turma
    Given A turma "Math 101-2024-2024" tem "5" alunos com ScriptAnswers
    When O sistema busca todos os ScriptAnswers da turma
    Then O servidor retorna status "200"
    And A resposta contém pelo menos "5" ScriptAnswers
    And Todos os ScriptAnswers pertencem à turma correta

    Scenario: Buscar ScriptAnswers de um aluno matriculado em uma turma
    Given Existe uma turma com ID "Math-101-2024"
    And Existe um estudante com CPF "12345678901" matriculado na turma "Math-101-2024"
    And Este estudante possui ScriptAnswers de IDs "201", "202" na turma "Math-101-2024"
    When Eu envio uma requisição GET para "/api/scriptanswers/enrollment?classId=Math-101-2024&studentId=12345678901"
    Then O servidor retorna status "200"
    And O servidor deve retornar uma lista contendo as respostas "201", "202"
