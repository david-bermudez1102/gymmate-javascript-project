class ProgramsController < ApplicationController
  def create
    trainer = Trainer.find_by(id: current_user.userable_id)
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

  def update
    trainer = Trainer.find_by(id: current_user.userable_id)
    program = trainer.programs.find_by(id: params[:id])
    if program.update(program_params)
      render json: program
    end
  end

  def destroy
    trainer = Trainer.find_by(id: current_user.userable_id)
    program = trainer.programs.find_by(id: params[:id])
    if program.destroy
      render json: program
    else
      render json: {errors: ["Content could not be deleted"]}
    end
  end

  private
    def program_params
      params.require(:program).permit(:title,:description,:video)
    end
end
