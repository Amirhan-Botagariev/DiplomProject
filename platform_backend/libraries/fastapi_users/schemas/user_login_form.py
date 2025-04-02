from fastapi import Form


class OAuth2PasswordRequestFormWithIIN:
    def __init__(
        self,
        iin: str = Form(..., pattern=r"^\d{12}$"),
        password: str = Form(...),
        scope: str = Form(""),
        client_id: str | None = Form(None),
        client_secret: str | None = Form(None),
    ):
        self.username = iin
        self.password = password
        self.scopes = scope.split()
        self.client_id = client_id
        self.client_secret = client_secret
