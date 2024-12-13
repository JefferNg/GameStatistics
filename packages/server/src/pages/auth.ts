import { html } from "@calpoly/mustang/server";
import renderPage from "./renderPage";

export class LoginPage {
    render() {
        return renderPage({
            scripts: [`
                import { define, Auth } from "@calpoly/mustang";
                import { LoginForm } from "/scripts/login-form.js";

                define({
                "mu-auth": Auth.Provider,
                "login-form": LoginForm
                })
            `],
            styles: [],
            body: html`
            <body>
                <mu-auth provides="account:auth">
                    <article>
                        <main class="page">
                            <login-form api="/auth/login">
                                <h3 slot="title">Sign in to view your games!</h3>
                            </login-form>
                            <p class="register">
                                Or
                                <a href="./register">
                                    Create an Account
                                </a>
                            </p>
                        </main>
                    </article>
                </mu-auth>
            </body>
            `
        });
    }
}