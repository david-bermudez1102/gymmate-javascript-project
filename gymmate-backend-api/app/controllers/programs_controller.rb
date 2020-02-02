class ProgramsController < ApplicationController
  def create
    account = Account.find_by(auth_token: params[:auth_token])
    trainer = Trainer.find_by(id: account.userable_id)
    program = trainer.programs.new(program_params)
    if program.save
      render json: program
    end
  end

  def index
    programs = Program.all
    render json: programs
  end

  def show
    program = Program.find_by(id: params[:id])
    render json: program
  end

  private
    def program_params
      params.require(:program).permit(:title,:description,:video)
    end
end
