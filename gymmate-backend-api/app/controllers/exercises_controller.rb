class ExercisesController < ApplicationController
  def create
    account = Account.find_by(auth_token: params[:auth_token])
    trainer = Trainer.find_by(id: account.userable_id)
    program = trainer.programs.find_by(id: exercise_params[:program_id])
    exercise = program.exercises.build(exercise_params)
    if exercise.save
      render json: exercise
    end
  end

  private
    def exercise_params
      params.require(:exercise).permit(:title,:sets,:program_id)
    end
end
