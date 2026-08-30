from pydantic import BaseModel


class RegisterRequest(BaseModel):

    full_name: str
    username: str
    role: str
    gmail: str
    password: str


class LoginRequest(BaseModel):

    identifier: str
    role: str
    password: str


class TokenResponse(BaseModel):

    access_token: str
    role: str