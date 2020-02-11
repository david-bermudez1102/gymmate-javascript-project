class ExercisesController < ApplicationController
  def create
    trainer = Trainer.find_by(id: current_user.userable_id)
    program = trainer.programs.find_by(id: exercise_params[:program_id])
    exercise = program.exercises.build(exercise_params)
    if exercise.save
      render json: exercise
    end
  end

  def update
    trainer = Trainer.find_by(id: current_user.userable_id)
    program = trainer.programs.find_by(id: exercise_params[:program_id])
    exercise = program.exercises.find_by(id: params[:id])
    if exercise.update(exercise_params)
      render json: exercise
    end
  end

  private
    def exercise_params
      params.require(:exercise).permit(:title,:description,:sets,:repetitions,:video,:program_id)
    end
end
