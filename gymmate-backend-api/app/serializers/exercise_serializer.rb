class ExerciseSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :sets, :repetitions, :program, :video, :calories, :rest
end
