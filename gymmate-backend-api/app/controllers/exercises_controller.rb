class ExercisesController < ApplicationController
  before_action :set_trainer, except: :show
  def create
    program = trainer.programs.find_by(id: exercise_params[:program_id])
    exercise = program.exercises.build(exercise_params)
    if exercise.save
      render json: exercise
    end
  end

  def update
    program = trainer.programs.find_by(id: exercise_params[:program_id])
    exercise = program.exercises.find_by(id: params[:id])
    if exercise.update(exercise_params)
      render json: exercise
    end
  end

  def show
    exercise = Exercise.find_by(id: params[:id])
    if exercise
      render json: exercise
    else
      render json: {errors: ["Content could not be found"]}
    end
  end

  def destroy
    exercise = Exercise.find_by(id: params[:id])
    program = trainer.programs.find_by(id: exercise.program_id)

    if program && exercise.destroy
      render json: exercise
    else
      render json: {errors: ["Content could not be deleted"]}
    end
  end

  private
    def exercise_params
      params.require(:exercise).permit(:title,:description,:sets,:repetitions,:video,:calories,:rest, :program_id)
    end

    def set_trainer
      trainer = Trainer.find_by(id: current_user.userable_id)
    end
end
