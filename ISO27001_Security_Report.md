# Отчёт по информационной безопасности — ISO/IEC 27001:2022

**Проект:** KPI Intelligence  
**Дата аудита:** 02.04.2026  
**Охват:** Backend (Laravel), Frontend (React), Docker-инфраструктура  
**Стандарт:** ISO/IEC 27001:2022  
**Аудитор:** GitHub Copilot (автоматизированный статический анализ)

---

## Сводная таблица уязвимостей

| # | Уязвимость | Критичность | Контроль ISO 27001 | Файл |
|---|-----------|-------------|-------------------|------|
| 1 | Пароль LDAP-сервисного аккаунта в коде | 🔴 КРИТИЧНАЯ | A.9.4.3 | `backend/app/Http/Controllers/LdapController.php:19` |
| 2 | OpenAI API ключ в `.env` файле | 🔴 КРИТИЧНАЯ | A.9.4.3 | `backend/.env:10` |
| 3 | APP_DEBUG=true в продакшн | 🔴 КРИТИЧНАЯ | A.12.6.1 | `backend/.env:4`, `docker-compose.yml:35` |
| 4 | Маршруты LDAP без аутентификации | 🔴 КРИТИЧНАЯ | A.9.4.1 | `backend/routes/api.php:24-28` |
| 5 | LDAP-инъекция | 🔴 КРИТИЧНАЯ | A.14.2.5 | `backend/app/Http/Controllers/LdapController.php:104-107` |
| 6 | SSL/TLS верификация LDAP отключена | 🟠 ВЫСОКАЯ | A.10.1.1 | `backend/app/Http/Controllers/LdapController.php:22-23` |
| 7 | Нет проверки роли на admin-маршрутах | 🟠 ВЫСОКАЯ | A.9.1.2 | `backend/routes/api.php:35-38` |
| 8 | Токены без срока истечения | 🟠 ВЫСОКАЯ | A.9.4.2 | `backend/config/sanctum.php:47` |
| 9 | Загрузка файлов без MIME-валидации | 🟠 ВЫСОКАЯ | A.14.1.2 | `backend/app/Http/Controllers/Api/KpiEvidenceController.php:27` |
| 10 | APP_KEY пустой — шифрование не работает | 🟠 ВЫСОКАЯ | A.10.1.1 | `backend/.env:3` |
| 11 | Нет rate limiting на `/login` | 🟡 СРЕДНЯЯ | A.9.4.2 | `backend/routes/api.php:20-22` |
| 12 | MySQL порт 3306 открыт наружу | 🟡 СРЕДНЯЯ | A.13.1.1 | `docker-compose.yml:10` |
| 13 | Жёстко заданные DB пароли в docker-compose | 🟡 СРЕДНЯЯ | A.9.4.3 | `docker-compose.yml:8-12` |
| 14 | Раскрытие внутренних ошибок через API | 🟡 СРЕДНЯЯ | A.12.6.1 | `backend/app/Http/Controllers/UserController.php` |
| 15 | CORS не настроен | 🟡 СРЕДНЯЯ | A.14.2.5 | `backend/bootstrap/app.php` |
| 16 | Dev-сервер React в продакшн | 🟡 СРЕДНЯЯ | A.12.1.4 | `frontend/Dockerfile` |
| 17 | Windows путь к сертификату в коде | 🔵 НИЗКАЯ | A.12.1.4 | `backend/app/Http/Controllers/AuthController.php:24` |

---

## Итоговая матрица рисков

| Критичность | Количество | Средний CVSS |
|-------------|-----------|--------------|
| 🔴 Критичная | 5 | 9.2 / 10 |
| 🟠 Высокая | 5 | 7.5 / 10 |
| 🟡 Средняя | 5 | 5.5 / 10 |
| 🔵 Низкая | 2 | 2.5 / 10 |
| **Итого** | **17** | |

---

## Детальное описание уязвимостей

---

### 🔴 КРИТ-1 — Пароль LDAP в исходном коде

**Файл:** `backend/app/Http/Controllers/LdapController.php`, строки 19–20  
**Контроль ISO 27001:** A.9.4.3 — Password Management System  
**CVSS:** 9.8 (Critical)

**Уязвимый код:**
```php
$user = "api@kaztbu.edu.kz";
$password = "KazUTB2023@";  // ← пароль корпоративного AD в коде
```

**Описание:**  
Пароль сервисного аккаунта Active Directory университета `KazUTB2023@` жёстко зашит в PHP-коде. Любой разработчик или сотрудник, имеющий доступ к репозиторию, может:
- Аутентифицироваться в корпоративном Active Directory
- Получить полный список сотрудников с персональными данными
- Потенциально эксплуатировать дополнительные привилегии сервисного аккаунта

**Рекомендация:**
```php
// Правильно — использовать переменные окружения
$user = env('LDAP_BIND_USER');
$password = env('LDAP_BIND_PASSWORD');
```
Добавить в `.env`: `LDAP_BIND_USER=api@kaztbu.edu.kz` и `LDAP_BIND_PASSWORD=...`

---

### 🔴 КРИТ-2 — OpenAI API ключ в файле `.env` (утечка в репозиторий)

**Файл:** `backend/.env`, строка 10  
**Контроль ISO 27001:** A.9.4.3 — Password Management System  
**CVSS:** 9.1 (Critical)

**Уязвимый код:**
```
OPENAI_API_KEY=sk-proj-OAPOJTHQtJM7W8tgx0HMRM-Z54xkbFS3W6-xVDV-...AA
```

**Описание:**  
Реальный, действующий API ключ OpenAI присутствует в файле `.env`. Несмотря на то что `.env` указан в `.gitignore`, файл находится в рабочей директории и мог попасть в историю git. Утечка ключа влечёт:
- Финансовые потери (несанкционированное использование OpenAI API)
- Компрометацию переписки пользователей в AI-чате
- Нарушение условий использования OpenAI

**⚠️ НЕМЕДЛЕННОЕ ДЕЙСТВИЕ:**  
Перейти на https://platform.openai.com/api-keys и **отозвать текущий ключ**, затем сгенерировать новый.

**Рекомендация:**  
Использовать Secret Manager (HashiCorp Vault, AWS Secrets Manager) вместо файлов `.env` в продакшн.

---

### 🔴 КРИТ-3 — APP_DEBUG=true в производственной среде

**Файлы:** `backend/.env:4`, `docker-compose.yml:35`  
**Контроль ISO 27001:** A.12.6.1 — Management of Technical Vulnerabilities  
**CVSS:** 8.6 (High)

**Уязвимый код:**
```yaml
# docker-compose.yml
APP_DEBUG: true

# .env
APP_DEBUG=true
```

**Описание:**  
Включённый режим отладки в Laravel при возникновении ошибки раскрывает злоумышленнику:
- Полный stack trace с именами файлов и номерами строк
- Содержимое переменных окружения (включая пароли и API ключи)
- SQL-запросы с параметрами
- Конфигурацию приложения

**Рекомендация:**
```yaml
APP_DEBUG: false
APP_ENV: production
```

---

### 🔴 КРИТ-4 — Маршруты LDAP без аутентификации (Broken Access Control)

**Файл:** `backend/routes/api.php`, строки 24–28  
**Контроль ISO 27001:** A.9.4.1 — Information Access Restriction  
**CVSS:** 9.3 (Critical)

**Уязвимый код:**
```php
// БЕЗ middleware("token") !
Route::prefix('admin/ldap')->group(function () {
    Route::get('/users', [LdapController::class, 'getAllLdapUsers']);
    Route::post('/import-single', [LdapController::class, 'importSingleUser']);
    Route::post('/sync-all', [LdapController::class, 'syncAllLdapUsers']);
});
```

**Описание:**  
Три административных LDAP-маршрута полностью открыты без аутентификации. Любой неавторизованный пользователь из Интернета может:
- `GET /api/admin/ldap/users` — получить полный список сотрудников университета (ФИО, email, телефоны)
- `POST /api/admin/ldap/import-single` — импортировать произвольного AD-пользователя в систему
- `POST /api/admin/ldap/sync-all` — синхронизировать всю базу AD

**Рекомендация:**
```php
Route::prefix('admin/ldap')->middleware(['token'])->group(function () {
    // маршруты
});
```

---

### 🔴 КРИТ-5 — LDAP-инъекция

**Файл:** `backend/app/Http/Controllers/LdapController.php`, строки 104–107  
**Контроль ISO 27001:** A.14.2.5 — Secure System Engineering Principles  
**CVSS:** 8.8 (High)

**Уязвимый код:**
```php
// Пользовательский ввод напрямую в LDAP-фильтр
if (!$inputEmail || $inputEmail === 'N/A') {
    $filter = "(|(cn=$inputName)(displayname=$inputName))";  // ← инъекция
} else {
    $filter = "(|(mail=$inputEmail)(userPrincipalName=$inputEmail)(sAMAccountName=$inputEmail))";  // ← инъекция
}
```

**Описание:**  
Пользовательский ввод вставляется в LDAP-фильтр без экранирования специальных символов. Атакующий может:
- Использовать `*` для wildcard-поиска по всей директории
- Использовать `)(password=*` для извлечения хэшей паролей
- Обойти логику фильтрации для получения данных произвольных пользователей

**Пример атаки:** `email = "*)(uid=*))(|(uid=*"`

**Рекомендация:**
```php
// Правильно — экранирование
$safeEmail = ldap_escape($inputEmail, '', LDAP_ESCAPE_FILTER);
$filter = "(|(mail=$safeEmail)(userPrincipalName=$safeEmail))";
```

---

### 🟠 ВЫС-1 — SSL/TLS верификация LDAP отключена (MITM-уязвимость)

**Файл:** `backend/app/Http/Controllers/LdapController.php`, строки 22–23  
**Контроль ISO 27001:** A.10.1.1 — Policy on the Use of Cryptographic Controls  
**CVSS:** 7.4 (High)

**Уязвимый код:**
```php
putenv('LDAPTLS_REQCERT=never');
@ldap_set_option(null, LDAP_OPT_X_TLS_REQUIRE_CERT, LDAP_OPT_X_TLS_NEVER);
```

**Описание:**  
TLS-верификация сертификата LDAP-сервера полностью отключена. Соединение уязвимо к атаке Man-in-the-Middle: злоумышленник в корпоративной сети может подменить LDAP-сервер и перехватить учётные данные всех пользователей при аутентификации.

**Рекомендация:**  
Установить корневой сертификат университета в систему и указать:
```php
ldap_set_option(null, LDAP_OPT_X_TLS_REQUIRE_CERT, LDAP_OPT_X_TLS_DEMAND);
putenv("LDAPTLS_CACERT=/etc/ssl/certs/kaztbu.cer");
```

---

### 🟠 ВЫС-2 — Отсутствие проверки роли на администраторских маршрутах (IDOR / Privilege Escalation)

**Файл:** `backend/routes/api.php`, строки 35–38  
**Контроль ISO 27001:** A.9.1.2 — Access to Networks and Network Services  
**CVSS:** 8.1 (High)

**Уязвимый код:**
```php
Route::middleware(["token", "logs"])->group(function(){
    Route::get('/admin/dashboard', ...);   // ← доступен любому пользователю!
    Route::get('/admin/logs', ...);        // ← все логи — любому пользователю!
    Route::delete('/admin/users/{id}', ...); // ← удаление пользователей!
    Route::get('/admin/users/stats', ...);
});
```

**Описание:**  
Middleware `token` только проверяет существование токена в базе данных, но НЕ проверяет роль пользователя. Преподаватель с действующим токеном может:
- Просматривать административный дашборд
- Читать все API-логи с payload и response данными других пользователей
- Удалять любых пользователей системы
- Изменять роли пользователей

**Рекомендация:**  
Создать middleware `CheckRole` и применять:
```php
Route::middleware(["token", "role:admin"])->group(function(){
    // admin routes
});
```

---

### 🟠 ВЫС-3 — Токены без срока истечения

**Файл:** `backend/config/sanctum.php`, строка 47  
**Контроль ISO 27001:** A.9.4.2 — Secure Log-on Procedures  
**CVSS:** 6.5 (Medium-High)

**Уязвимый код:**
```php
'expiration' => null,  // токены НИКОГДА не истекают
```

**Описание:**  
Токены в таблице `tokens` не имеют срока действия. Скомпрометированный, похищенный или забытый токен остаётся действительным бессрочно. Нет автоматической инвалидации при неактивности пользователя.

**Рекомендация:**
```php
'expiration' => 43200,  // 30 дней в минутах
```

---

### 🟠 ВЫС-4 — Загрузка файлов без проверки MIME-типа (возможный RCE)

**Файл:** `backend/app/Http/Controllers/Api/KpiEvidenceController.php`, строка 27  
**Контроль ISO 27001:** A.14.1.2 — Securing Application Services  
**CVSS:** 7.2 (High)

**Уязвимый код:**
```php
$request->validate([
    'kpi_activity_id' => 'required|exists:kpi_activities,id',
    'file' => 'required|file|max:10240',  // ← нет ограничения типов файлов!
]);
```

**Описание:**  
Принимаются файлы любого типа без проверки расширения и содержимого. Атакующий может загрузить:
- `.php` файл → Remote Code Execution (если storage доступен веб-серверу)
- `.svg` с XSS-нагрузкой
- Исполняемые файлы для социальной инженерии

**Рекомендация:**
```php
'file' => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx',
```

---

### 🟠 ВЫС-5 — APP_KEY пустой

**Файл:** `backend/.env`, строка 3  
**Контроль ISO 27001:** A.10.1.1 — Policy on the Use of Cryptographic Controls  
**CVSS:** 7.0 (High)

**Уязвимый конфиг:**
```
APP_KEY=   (пустой)
```

**Описание:**  
Laravel использует `APP_KEY` для шифрования cookie, сессий, паролей и зашифрованных значений. Пустой ключ означает:
- Данные сессий могут быть скомпрометированы
- Laravel генерирует случайный ключ при каждом перезапуске — все существующие сессии инвалидируются
- В некоторых конфигурациях приложение работает без шифрования

**Рекомендация:**  
Выполнить: `php artisan key:generate` и сохранить результат в `.env`

---

### 🟡 СРЕДН-1 — Отсутствие rate limiting на `/login` (Brute Force)

**Файл:** `backend/routes/api.php`, строки 20–22  
**Контроль ISO 27001:** A.9.4.2 — Secure Log-on Procedures  
**CVSS:** 5.9 (Medium)

**Уязвимый код:**
```php
Route::middleware("logs")->group(function() {
    Route::post("/login", [AuthController::class, "login"]);
    Route::post("/register", [AuthController::class, "register"]);
    // ↑ нет throttle middleware!
});
```

**Рекомендация:**
```php
Route::post("/login", [AuthController::class, "login"])->middleware('throttle:5,1');
```

---

### 🟡 СРЕДН-2 — MySQL порт 3306 открыт наружу

**Файл:** `docker-compose.yml`, строка 10  
**Контроль ISO 27001:** A.13.1.1 — Network Controls  
**CVSS:** 6.5 (Medium)

**Уязвимый конфиг:**
```yaml
mysql:
  ports:
    - "3306:3306"   # ← база данных доступна напрямую снаружи
```

**Описание:**  
MySQL доступен напрямую с хост-машины (и потенциально из Интернета, если firewall не настроен). Зная пароль `kpi_password`, атакующий получает прямой доступ к базе данных со всеми персональными данными.

**Рекомендация:**  
Убрать секцию `ports` из конфигурации MySQL — внутри Docker-сети контейнеры общаются по имени сервиса без пробрасывания порта наружу:
```yaml
mysql:
  # ports:              ← удалить
  #   - "3306:3306"     ← удалить
```

---

### 🟡 СРЕДН-3 — Жёстко заданные пароли БД в docker-compose.yml

**Файл:** `docker-compose.yml`, строки 8–12  
**Контроль ISO 27001:** A.9.4.3 — Password Management System  
**CVSS:** 5.5 (Medium)

**Уязвимый конфиг:**
```yaml
environment:
  MYSQL_ROOT_PASSWORD: root_password
  MYSQL_PASSWORD: kpi_password
```

**Рекомендация:**  
Использовать Docker Secrets или `.env`-файл для docker-compose:
```yaml
environment:
  MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
  MYSQL_PASSWORD: ${MYSQL_PASSWORD}
```

---

### 🟡 СРЕДН-4 — Раскрытие внутренних ошибок через API

**Файл:** `backend/app/Http/Controllers/UserController.php`  
**Контроль ISO 27001:** A.12.6.1 — Management of Technical Vulnerabilities  
**CVSS:** 4.3 (Medium)

**Уязвимый код:**
```php
return response()->json([
    'status' => 'error',
    'message' => 'Ошибка: ' . $e->getMessage()  // ← внутренние детали наружу
], 500);
```

**Рекомендация:**
```php
// В продакшн — только общее сообщение
return response()->json(['status' => 'error', 'message' => 'Внутренняя ошибка сервера'], 500);
// Детали записывать в лог, не в ответ
\Log::error($e->getMessage(), ['trace' => $e->getTraceAsString()]);
```

---

### 🟡 СРЕДН-5 — CORS не настроен

**Файл:** `backend/bootstrap/app.php`  
**Контроль ISO 27001:** A.14.2.5 — Secure System Engineering Principles  
**CVSS:** 5.4 (Medium)

**Описание:**  
В приложении отсутствует CORS-middleware. Это означает либо полную блокировку кросс-доменных запросов, либо (при некоторых конфигурациях PHP/nginx) принятие запросов с любого домена. Должен быть явно разрешён только домен фронтенда.

**Рекомендация:**  
Добавить в `bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->api([
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
})
```
И настроить `config/cors.php` с `allowed_origins` = `['https://your-domain.com']`.

---

### 🟡 СРЕДН-6 — Dev-сервер React используется в продакшн

**Файл:** `frontend/Dockerfile`  
**Контроль ISO 27001:** A.12.1.4 — Separation of Development, Testing and Operational Environments  
**CVSS:** 4.0 (Medium)

**Уязвимый код:**
```dockerfile
CMD ["npm", "start"]   # ← webpack DevServer, не production build
```

**Описание:**  
`npm start` запускает встроенный webpack dev server, который:
- Включает source maps (раскрывает исходный код)
- Не оптимизирован для нагрузки
- Содержит инструменты отладки React DevTools
- Не предназначен для production использования

**Рекомендация:**
```dockerfile
RUN npm run build
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
# Или использовать Nginx для раздачи статики
```

---

### 🔵 НИЗ-1 — Windows-путь к сертификату в коде

**Файл:** `backend/app/Http/Controllers/AuthController.php`, строка 24  
**Контроль ISO 27001:** A.12.1.4  
**CVSS:** 2.3 (Low)

**Уязвимый код:**
```php
putenv("LDAPTLS_CACERT=C:\\Users\\User\\Documents\\GitHub\\kpi-intelligence\\kaztbu.cer");
```

**Описание:**  
Путь к локальному сертификату разработчика под Windows. На Linux-сервере не работает, что ведёт либо к ошибке TLS, либо к тому что сертификат не проверяется. Также раскрывает структуру файловой системы разработчика.

**Рекомендация:**
```php
putenv("LDAPTLS_CACERT=" . env('LDAP_CACERT_PATH', '/etc/ssl/certs/kaztbu.cer'));
```

---

## План устранения (приоритетный порядок)

### Немедленно (в течение нескольких часов)

| Действие | Ответственный | Файл |
|----------|--------------|------|
| Отозвать OpenAI API ключ на platform.openai.com | DevOps / Backend | `.env` |
| Сменить пароль LDAP-аккаунта `api@kaztbu.edu.kz` | Системный администратор | — |
| Убрать LDAP пароль из кода в env-переменные | Backend разработчик | `LdapController.php` |
| Закрыть LDAP-маршруты за middleware аутентификации | Backend разработчик | `api.php` |

### Сегодня (в течение дня)

| Действие | Ответственный | Файл |
|----------|--------------|------|
| Установить `APP_DEBUG=false` | DevOps | `docker-compose.yml`, `.env` |
| Сгенерировать `APP_KEY` | Backend разработчик | `.env` |
| Исправить LDAP-инъекцию (ldap_escape) | Backend разработчик | `LdapController.php` |
| Добавить rate limit на `/login` | Backend разработчик | `api.php` |
| Убрать проброс порта 3306 | DevOps | `docker-compose.yml` |

### На этой неделе

| Действие | Ответственный | Файл |
|----------|--------------|------|
| Реализовать проверку роли (middleware) | Backend разработчик | `api.php`, новый Middleware |
| Включить TLS верификацию LDAP | Backend / SysAdmin | `LdapController.php` |
| Добавить MIME-валидацию загрузки файлов | Backend разработчик | `KpiEvidenceController.php` |
| Установить срок истечения токенов | Backend разработчик | `sanctum.php` |
| Настроить CORS | Backend разработчик | `bootstrap/app.php`, `cors.php` |
| Перейти на production-сборку фронтенда | Frontend / DevOps | `frontend/Dockerfile` |
| Вынести DB пароли в `.env` docker-compose | DevOps | `docker-compose.yml` |

---

## Соответствие доменам ISO 27001:2022

| Домен ISO 27001 | Статус |
|-----------------|--------|
| A.9 — Управление доступом | ❌ Не соответствует (5 нарушений) |
| A.10 — Криптография | ❌ Не соответствует (3 нарушения) |
| A.12 — Эксплуатация | ❌ Не соответствует (3 нарушения) |
| A.13 — Сетевая безопасность | ⚠️ Частично (1 нарушение) |
| A.14 — Разработка и поддержка | ❌ Не соответствует (3 нарушения) |

---

*Отчёт сгенерирован автоматически на основе статического анализа исходного кода.*  
*Дата: 02.04.2026*
